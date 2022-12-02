import requests
import json
import validators
import requests
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.urls import reverse
from django.db import IntegrityError
from django.core.paginator import Paginator
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from .models import Calendar, DailyPlan, Meal, User, MealComponent, Recipe, Ingredient, RecipeIngredient


def calorie_calc(age, sex, height, weight, bfat, energy_unit, formula):
    # Calculate user's daily calories based on data
    BMR = 0
    if formula == "0":
        BMR = Mifflin(sex, age, height, weight)
    elif formula == "1":
        BMR = Harris(sex, age, height, weight)
    else:
        BMR = Katch(bfat, weight)
    if energy_unit == "calories":
        return float(BMR)
    else:
        return float(BMR * 4.1868)


def Mifflin(sex, age, height, weight):
    BMR = (10*weight) + (6.25*height) - (5*age) + 5
    if sex == "female":
        BMR = (10*weight) + (6.25*height) - (5*age) - 161
    return BMR


def Harris(sex, age, height, weight):
    BMR = (13.397*weight) + (4.799*height) - (5.677*age) + 88.362
    if sex == "female":
        BMR = (9.247*weight) + (3.098*height) - (4.330*age) + 447.593
    return BMR


def Katch(bfat, weight):
    BMR = 370 + 21.6*(1 - (bfat/100))*weight
    return BMR


def recipe_url_lookup(recipe_url):
    url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/extract"
    querystring = {"url": recipe_url}

    headers = {
        "X-RapidAPI-Key": "54f6cccfadmsh62843227344ff6cp1e8c7cjsn2f01922300a8",
        "X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
    }
    response = requests.request(
        "GET", url, headers=headers, params=querystring)
    recipe_info = response.json()

    return recipe_info


# Simple function to call the API to convert non-metric units to metric for ease of measuring. This function is used in recipe_to_db.
def get_grams_amount(ingredient, item):
    metric_amount=item['measures']['metric']['amount']
    metric_unit=item['measures']['metric']['unitShort']
    imperial_amount=item['measures']['us']['amount']
    imperial_unit=item['measures']['us']['unitShort']
    # Try to find a previously logged "recipe ingredient" that contains this same "ingredient" with the same base measuring units (metric or imperial)...
    preexisting_ingredient = RecipeIngredient.objects.filter(
        ingredient=ingredient)
    if len(preexisting_ingredient) > 0:
        metric_match = preexisting_ingredient.filter(metric_unit=metric_unit)
        imperial_match = preexisting_ingredient.filter(
            imperial_unit=imperial_unit)
        # and use that to calculate the amount in grams of this new ingredient, using simple correlation.
        try:
            if len(metric_match) > 0:
                metric_match = metric_match[0]
                grams_amount = (metric_amount / metric_match.metric_amount) * metric_match.grams_amount
            elif len(imperial_match) > 0:
                imperial_match = imperial_match[0]
                grams_amount = (imperial_amount / imperial_match.imperial_amount) * imperial_match.grams_amount
            else:
               grams_amount = convert(ingredient, imperial_amount, metric_amount, imperial_unit, metric_unit)
        except:
            grams_amount = convert(ingredient, imperial_amount, metric_amount, imperial_unit, metric_unit)
    # As a last resort call the API to convert it to grams
    else:
        grams_amount = convert(ingredient, imperial_amount, metric_amount, imperial_unit, metric_unit)

    return grams_amount

def convert(ingredient, imperial_amount, metric_amount, imperial_unit, metric_unit):
    if metric_amount != None and metric_amount != 0:
        grams_amount = api_gram_conversion(
            ingredient.name, metric_amount, metric_unit)
        return grams_amount
    elif imperial_amount != None and imperial_amount != 0:
        grams_amount = api_gram_conversion(
            ingredient.name, imperial_amount, imperial_unit)
        return grams_amount
    else:
        raise Exception("Seems there are no measurements in this recipe.")
    


def api_gram_conversion(name, amount, unit):
    url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/convert"

    querystring = {"targetUnit": "grams", "ingredientName": name,
                   "sourceAmount": amount, "sourceUnit": unit}

    headers = {
        "X-RapidAPI-Key": "54f6cccfadmsh62843227344ff6cp1e8c7cjsn2f01922300a8",
        "X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
    }

    response = requests.request(
        "GET", url, headers=headers, params=querystring)

    response_parse = response.json()

    # If, for some reason, the API doesn't get a valid read on the ingredients, and thus can't convert their amounts (bad data), we return an error message.
    try:
        grams_amount = response_parse['targetAmount']
        return grams_amount
    except:
        error = "Invalid website."
        return JsonResponse({"error": error})

# Another function dedicated to calling the API, this time to get the calories of the ingredients, in case they don't yet exist in the database.
def get_calories(grams_amount, api_id):  
    url = f"https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/{api_id}/information"

    querystring = {"amount": grams_amount,"unit":"grams"}

    headers = {
        "X-RapidAPI-Key": "54f6cccfadmsh62843227344ff6cp1e8c7cjsn2f01922300a8",
        "X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
    }

    response = requests.request("GET", url, headers=headers, params=querystring)
    try:
        response_parse = response.json()
        for item in response_parse['nutrition']['nutrients']:
            if item['name'] == "Calories":
                calories_amount = item['amount']
                return calories_amount
        calories_amount = 0
        return calories_amount
    #If, for some reason, the API doesn't get a valid read on the ingredients, and thus can't get their calories (bad data), we return an error message.
    except:
        calories_amount = 0
        return calories_amount
   
   
# THIS BREAKS IF THE SAME INGREDIENT GETS REQUESTED FOR THE FIRST TIME, AT THE SAME TIME, ON TWO DIFFERENT RECIPES
# HOW TO FIX? (THE TRY FAILS ON BOTH, THEN ONE OF THEM LOGS IT THROUGH EXCEPT, AND THE OTHER RECIPE'S EXCEPT FAILS THE UNIQUE CONSTRAINT)
def get_ingredient(item):
    # Step 2.1.1:
    # Look for the ingredients (using api_id)
    try:
        # A better solution for this?
        if item['name'] == 'vegetable oil':
            item['nameClean'] = 'cooking oil'
            item['id'] = 4582
        elif item['nameClean'] == None:
            item['nameClean'] = 'Error'
            item['id'] = -1
        print(item['id'], item['nameClean'])
        # POSSIBLE SOLUTION: CHANGE THIS TO FILTER AND RETURN THE FIRST QUERY RESULT?
        ingredient = Ingredient.objects.get(api_id=item['id'], name=item['nameClean'])
      # If not found, log the ingredient:
    except:
        ingredient = Ingredient(
            name=item['nameClean'],
            api_id=item['id'],
            image=item['image']
        )
        # Call the spoonacular API to get calories per gram
        calories_per_gram = get_calories(1, item['id'])
        ingredient.calories_per_gram = calories_per_gram
        ingredient.save()
    return ingredient


def add_ingredients_to_recipe(ingredient_dictionary, new_recipe, total_calories):
    # Step 2.1:
    # Make the ingredient out of the produce:
    for item in ingredient_dictionary:
        # Assign the measuring units returned by the spoonacular API
        new_recipe_ingredient = RecipeIngredient(
            metric_amount=item['measures']['metric']['amount'],
            metric_unit=item['measures']['metric']['unitShort'],
            imperial_amount=item['measures']['us']['amount'],
            imperial_unit=item['measures']['us']['unitShort'],
        )
        # Step 2.1.1:
        # Get the ingredient.
        ingredient = get_ingredient(item)
        new_recipe_ingredient.ingredient = ingredient
        new_recipe_ingredient.grams_amount = get_grams_amount(
            ingredient, item)
        # Send this ingredient's calories to the list to be added later
        ingredient_calories = ingredient.calories_per_gram * new_recipe_ingredient.grams_amount
        total_calories.append(ingredient_calories)
        new_recipe_ingredient.save()
        new_recipe.recipe_ingredients.add(new_recipe_ingredient)

def get_day(request):
    # Receive date and user through fetch request
    data = json.loads(request.body)
    date = data.get('date')
    date = date[:10]
    user = request.user
    calendar = Calendar.objects.get(user=user)
    # Get user's daily plan using the date
    day = calendar.days.get(date=date)
    return day
    

def dictionary_sanitary_check(dictionary):
    try:
        dictionary['ketogenic']
    except:
        dictionary['ketogenic'] = False
    try:
        dictionary['glutenFree']
    except:
        dictionary['glutenFree'] = False
    try:
        dictionary['vegan']
    except:
        dictionary['vegan'] = False
    try:
        dictionary['vegetarian']
    except:
        dictionary['vegetarian'] = False
    try:
        dictionary['dairyFree']
    except:
        dictionary['dairyFree'] = False