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
from .util import recipe_url_lookup, get_grams_amount, get_calories, get_ingredient, add_ingredients_to_recipe
from django.views.decorators.csrf import csrf_exempt


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


# MAKE THIS A STATELESS REST API

@csrf_exempt
def get_recipe(request, id):
    recipe = Recipe.objects.get(pk=id)
    ingredients = Recipe.list_ingredients()
    recipe_info = {
        "recipe": recipe,
        "ingredients": ingredients
    }
    return JsonResponse(recipe_info)

@csrf_exempt
def extract_recipe_from_url(request):
    data = json.loads(request.body)
    # Look for recipe in the database using the URL
    recipe_url = data.get('url')
    try:
        recipe = Recipe.objects.get(url=recipe_url)
    # If it's not found, call the spoonacular API
    except:
        recipe_info = recipe_url_lookup(recipe_url)
        # Log the recipe to the database
        log_recipe(recipe_info)
        recipe = Recipe.objects.get(url=recipe_url)
    # Return recipe's ID
    return JsonResponse({"id": recipe.id})

# USE RANDOM RECIPE API REQUEST TO POPULATE THE DATABASE!

@csrf_exempt
def log_recipe(dictionary):
    # Step 1:
    # Make a recipe object (name, api_id, url, total_servings)
    new_recipe = Recipe(
        name=dictionary['title'],
        api_id=dictionary['id'],
        url=dictionary['sourceUrl'],
        total_servings=dictionary['servings'],
        image=dictionary['image'],
        cuisine=dictionary['cuisines'],
        credit = dictionary['creditText'],
        vegan=dictionary['vegan'],
        vegetarian=dictionary['vegetarian'],
        ketogenic=dictionary['ketogenic'],
        gluten_free=dictionary['glutenFree'],
        dairy_free=dictionary['dairyFree']
    )
    new_recipe.save()
    # Declare a total calories variable
    total_calories = []
    # Step 2:
    # Make the recipe ingredients
    # Loop over all the ingredients present in dictionary['extendedIngredients']:
    add_ingredients_to_recipe(dictionary['extendedIngredients'], new_recipe, total_calories)
    # Step 3:
    # Assign the total calories variable to the total_calories attribute of the recipe
    new_recipe.calories = sum(total_calories)
    if not validators.url(new_recipe.url):
        new_recipe.url = f"/recipe/{new_recipe.pk}"
    new_recipe.save()
    # Save recipe (can i do recipe.pk after saving to get its newly assigned id?)
    # Return the recipe's ID
    return JsonResponse({"recipe_id": new_recipe.pk})

def make_custom_recipe(request):
    # Receive through fetch:
    data = json.loads(request.body)
    dictionary = data.get('recipe')
    dictionary['creditText'] = request.user.username
    recipe_url = dictionary['sourceUrl']
    # Look for recipe in the database using the URL
    try:
        if not validators.url(recipe_url):
            raise Exception("Invalid URL submitted")
        recipe = Recipe.objects.get(url=recipe_url)
    # If it's not found
    except:
        # Log the recipe to the database
        log_recipe(dictionary)
    # How to prevent gibberish from calling the API? Maybe lock to ingredients that are in the database already? (would make it easy to retrieve the api_id)

    

# TODO def save_meal(request):
    # Receive the date and meal type through the fetch request
    # Receive the recipe id and servings through the fetch request
    # Get or create user's calendar
    # Check calendar for the DailyPlan object corresponding to the date received through fetch
    # If the object doesn't exist, make a DailyPlan object (date)
    # Look for a Meal object within the DailyPlan object, using the meal type as filter. Make a new one if not found. (get_or_create)
    # Get the recipe object using recipe id
    # Look for a meal component that already has this recipe. If found, add the servings to the preexisting amount.
    # If not found, make a new Meal Component object (recipe, servings) and add it to the Meal object.

# TODO def get_daily_plan(request):
    # Receive date through fetch request
    # Get user's daily plan using the date
    # Serialize the day (function in models.py)
    # Send the result to the frontend

# TODO def remove_from_daily_plan(request):
    # Get user's calendar
    # Get DailyPlan using the date stored in front-end
    # Get Meal using the meal_type stored in the front-end
    # Get recipe in the meal using its id
    # Get meal component using the recipe
    # Remove the meal component

# TODO def like_recipe_handler(request):
    # TODO Make a model for the likes
    # Route to like and unlike recipes

# TODO def favorite_recipe(request):
    # TODO Make a model for this
    # Similar to likes, but can be displayed differently?
