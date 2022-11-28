import json
import validators
from rest_framework.response import Response
from knox.models import AuthToken
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .serializers import UserSerializer, RegisterSerializer
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate, login, logout, get_user_model
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.urls import reverse
from django.db import IntegrityError
from django.core.paginator import Paginator
from django.forms.models import model_to_dict
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from .models import Calendar, DailyPlan, Meal, User, MealComponent, Recipe, Ingredient, RecipeIngredient, Like, Favorite
from .util import dictionary_sanitary_check, recipe_url_lookup, add_ingredients_to_recipe, get_day
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from .serializers import ChangePasswordSerializer
from rest_framework.permissions import IsAuthenticated



# MAKE THIS A STATELESS REST API
# CSRF PROBLEMS SOLUTION: https://stackoverflow.com/questions/50732815/how-to-use-csrf-token-in-django-restful-api-and-react

class LoginAPI(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return super(LoginAPI, self).post(request, format=None)

def logout(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


# Register API
class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
        "user": UserSerializer(user, context=self.get_serializer_context()).data,
        "token": AuthToken.objects.create(user)[1]
        })


class ChangePasswordView(generics.UpdateAPIView):
    """
    An endpoint for changing password.
    """
    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = (IsAuthenticated,)

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            response = {
            'status': 'success',
            'code': status.HTTP_200_OK,
            'message': 'Password updated successfully',
            'data': []
            }

            return Response(response)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def get_all_recipes(request):
    recipes = Recipe.objects.all()
    recipes = recipes.order_by('name')
    recipe_list = []
    for recipe in recipes:
        recipe_dict = model_to_dict(recipe)
        # Pop recipe_ingredients field, because you can't serialize models as json
        recipe_dict.pop('recipe_ingredients')
        recipe_list += [recipe_dict]
    return JsonResponse({'list': recipe_list})

@api_view(['POST'])
def get_recipe(request, id):
    recipe = Recipe.objects.get(pk=id)
    recipe_dict = model_to_dict(recipe)
    ingredients = Recipe.list_ingredients(recipe)
    # Pop recipe_ingredients field, because you can't serialize models as json
    recipe_dict.pop('recipe_ingredients')
    recipe_info = {
        "recipe": recipe_dict,
        "ingredients": ingredients
    }
    return JsonResponse({"info": recipe_info})

@csrf_exempt
def extract_recipe_from_url(request):
    data = json.loads(request.body)
    # Look for recipe in the database using the URL
    recipe_url = data.get('url')
    if validators.url(recipe_url) == True:
        try:
            recipe = Recipe.objects.get(url=recipe_url)
        # If it's not found, call the spoonacular API
        except:
            recipe_info = recipe_url_lookup(recipe_url)
            # Log the recipe to the database
            recipe = log_recipe(recipe_info)
        # Return recipe's ID
        return JsonResponse({"id": recipe.id})
    else:
        return JsonResponse({"error": "Invalid URL!"})

# USE RANDOM RECIPE API REQUEST TO POPULATE THE DATABASE!


def log_recipe(dictionary):
    # Step 1:
    dictionary_sanitary_check(dictionary)
    # Make a recipe object, minus the ingredients
    new_recipe = Recipe(
        name=dictionary['title'],
        api_id=dictionary['id'],
        url=dictionary['sourceUrl'],
        total_servings=dictionary['servings'],
        image=dictionary['image'],
        cuisine=dictionary['cuisines'],
        credit=dictionary['creditsText'],
        vegan=dictionary['vegan'],
        vegetarian=dictionary['vegetarian'],
        ketogenic=dictionary['ketogenic'],
        gluten_free=dictionary['glutenFree'],
        dairy_free=dictionary['dairyFree']
    )
    new_recipe.save()
    # Total calories variable to be used later
    total_calories = []
    # Step 2:
    # Make the recipe ingredients
    # Loop over all the ingredients present in dictionary['extendedIngredients']:
    add_ingredients_to_recipe(
        dictionary['extendedIngredients'], new_recipe, total_calories)
    # Step 3:
    # Assign the total calories variable to the total_calories attribute of the recipe
    # The calories of each ingredient are inserted into the list by the function above
    new_recipe.calories = sum(total_calories)
    if not validators.url(new_recipe.url):
        new_recipe.url = f"/recipe/{new_recipe.pk}"
    new_recipe.save()
    # Save recipe (can i do recipe.pk after saving to get its newly assigned id?)
    # Return the recipe's ID
    return new_recipe


@api_view(['POST'])
def make_custom_recipe(request):
    # Receive through fetch:
    data = json.loads(request.body)
    dictionary = data.get('recipe')
    # FIX THIS SHIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIT
    # request.user.username when there are users
    dictionary['creditsText'] = 'briko'
    recipe_url = dictionary['sourceUrl']
    # Look for recipe in the database using the URL
    try:
        if not validators.url(recipe_url):
            raise Exception("Invalid URL submitted")
        recipe = Recipe.objects.get(url=recipe_url)
    # If it's not found
    except:
        # Log the recipe to the database
        recipe = log_recipe(dictionary)
    return JsonResponse({"id": recipe.pk})
    # How to prevent gibberish from calling the API? Maybe lock to ingredients that are in the database already? (would make it easy to retrieve the api_id)


@api_view(['POST'])
def remove_recipe(request):
    data = json.loads(request.body)
    recipe_id = data.get('recipeId')
    recipe = Recipe.objects.get(pk=recipe_id)
    if recipe.credit == request.user:
        recipe.delete()


@api_view(['POST'])
def get_daily_plan(request):
    day = get_day(request)
    # Serialize the day (function in models.py)
    day_dictionary = DailyPlan.serialize(day)
    # Send the result to the frontend
    return JsonResponse({"day": day_dictionary})


# Break down this function after testing
@api_view(['POST'])
def add_to_daily_plan(request):
    data = json.loads(request.body)
    # Receive the date and meal type through the fetch request
    meal_type = data.get('mealType')
    date = data.get('date')
    # Receive the recipe id and servings through the fetch request
    recipe_id = data.get('recipeId')
    servings = data.get('servings')
    # Get or create user's calendar
    calendar = Calendar.objects.get_or_create(user=request.user)
    # Check calendar for the DailyPlan object corresponding to the date received through fetch
    try:
        day = calendar.days.get(date=date)
    # If the object doesn't exist, make a DailyPlan object (date)
    except:
        day = DailyPlan(
            date=date
        )
        day.save()
        calendar.days.add(day)
    # Look for a Meal object within the DailyPlan object, using the meal type as filter. Make a new one if not found. (get_or_create)
    meal = day.meals.get_or_create(meal_type=meal_type)
    # Get the recipe object using recipe id
    recipe = Recipe.objects.get(pk=recipe_id)
    # Look for a meal component that already has this recipe. If found, add the servings to the preexisting amount.
    # If not found, make a new Meal Component object (recipe, servings) and add it to the Meal object.
    meal_component = meal.components.get_or_create(recipe=recipe)
    if meal_component.servings > 0:
        meal_component.servings += meal_component.servings + servings
    else:
        meal_component.servings = servings
    meal_component.save()
    meal.save()
    day.save()


@api_view(['POST'])
def remove_from_daily_plan(request):
    data = json.loads(request.body)
    day = get_day(request)
    # Get Meal using the meal_type stored in the front-end
    meal_type = data.get('mealType')
    meal = day.meals.get(meal_type=meal_type)
    # Get recipe in the meal using its id
    recipe_id = data.get('recipeId')
    recipe = Recipe.objects.get(pk=recipe_id)
    # Get meal component using the recipe
    meal_component = meal.components.get(recipe=recipe)
    # Remove the meal component
    meal.components.remove(meal_component)


@api_view(['POST'])
def likes_handler(request):
    data = json.loads(request.body)
    recipe_id = data.get('recipeId')
    recipe = Recipe.objects.get(pk=recipe_id)
    user = request.user
    try:
        preexisting_like = recipe.likes.get(user=user)
        Like.remove_like(recipe, user)
    except:
        Like.add_like(recipe, user)


@api_view(['POST'])
def favorites_handler(request):
    data = json.loads(request.body)
    recipe_id = data.get('recipeId')
    recipe = Recipe.objects.get(pk=recipe_id)
    user = request.user
    try:
        preexisting_favorite = user.favorites.get(recipe=recipe)
        Favorite.remove_favorite(user, recipe)
    except:
        Favorite.add_favorite(user, recipe)

@api_view(['POST'])
def get_all_ingredients(request):
    ingredients = Ingredient.objects.all()
    ingredient_list = []
    for ingredient in ingredients:
        dict = model_to_dict(ingredient)
        ingredient_list += [dict]
    return JsonResponse({"list": ingredient_list})

@api_view(['POST'])
def get_all_measures(request):
    units = []
    recipe_ingredients = RecipeIngredient.objects.all().values('metric_unit', 'imperial_unit')
    for item in recipe_ingredients:
        if item['metric_unit'] != None:
            if item['metric_unit'].lower() not in units:
                units += [item['metric_unit'].lower()]
        if item['imperial_unit'] != None:
            if item['imperial_unit'].lower() not in units:
                units += [item['imperial_unit'].lower()]
    return JsonResponse({"list": units})