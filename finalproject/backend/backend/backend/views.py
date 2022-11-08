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
from .util import recipe_url_lookup, get_grams_amount, get_calories


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

def get_recipe(request, id):
  recipe = Recipe.objects.get(pk=id)
  recipe_info = Recipe.get_ingredients()
  return JsonResponse(recipe_info)


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


def log_recipe(dictionary):
    # Step 1:
    # Make a recipe object (name, api_id, url, total_servings)
    new_recipe = Recipe(
      name=dictionary['title'],
      api_id=dictionary['id'],
      url=dictionary['sourceUrl'],
      total_servings=dictionary['servings'],
      image=dictionary['image'],
      cuisine=dictionary['cuisine']
    )
    # Declare a total calories variable
    total_calories = 0
    # Step 2:
    # Make the recipe ingredients
    # Loop:
    for item in dictionary['extendedIngredients']:
        new_recipe_ingredient = RecipeIngredient(
          metric_amount=item.measures.metric.amount,
          metric_unit=item.measures.metric.unitShort,
          imperial_amont=item.measures.us.amount,
          imperial_unit=item.measures.us.unitShort,
        )
        # Step 2.1:
          # Look for the ingredients (using api_id)
        try:
            ingredient = Ingredient.objects.get(pk=item.id)
            new_recipe_ingredient.ingredient = ingredient
            new_recipe_ingredient.grams_amount = get_grams_amount(
                ingredient, item)
          # If not found, log the ingredient:
        except:
            new_ingredient = Ingredient(
              name=item.nameClean,
              api_id=item.id,
              image=item.image
            )
            # Call the spoonacular API to get calories per gram (call 1 gram)
            calories_per_gram = get_calories(1, item.id)
            new_ingredient.calories_per_gram = calories_per_gram
            new_ingredient.save()
            new_recipe_ingredient.ingredient = new_ingredient
        ####### send calories to recipe somehow
        new_recipe.recipe_ingredients.add()
        # Rest of info should be in the dictionary already

    # Step 2.2:
    # Make the ingredient out of the produce:
    # Check the metric unit returned by the spoonacular API
    # If it's not gram or grams:
    # Try:
    # to find a previously logged ingredient that contains this same produce with the same base measuring units (metric or imperial)
    # and use that to calculate the amount in grams of this new ingredient, using simple correlation.
    # Except:
    # As a last resort call the API to convert it to grams
    # (Not very happy with this way of dealing with the problem)
    # With the produce amount in grams, we consult the calories per gram information in the produce and calculate the total calories of this ingredient
    # We add this value to the total calories variable
    # Save all the above with whatever measures we get from the dictionary
    # Add the ingredient to the recipe object

    # Step 3:
    # Assign the total calories variable to the total_calories attribute of the recipe
    # Save recipe (can i do recipe.pk after saving to get its newly assigned id?)
    # Return a dictionary with all this information or use get_recipe()? Performance considerations?

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

    # TODO def make_custom_recipe(request):
    # Receive through fetch:
    # Ingredients with produce name, amount and measuring unit
    # How to prevent gibberish from calling the API? Maybe lock to ingredients that are in the database already? (would make it easy to retrieve the api_id)
    # Recipe name and user's username
    # Instructions are optional (only make recipes with instructions public?)
    # Call log_recipe() with a dictionary that mimics the spoonacular dictionary
    # URL for the custom recipe will reference its ID in the database. How do I get this ID before saving the object?

    # TODO def like_recipe_handler(request):
    # TODO Make a model for the likes
    # Route to like and unlike recipes

    # TODO def favorite_recipe(request):
    # TODO Make a model for this
    # Similar to likes, but can be displayed differently?
