from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models


class User(AbstractUser):
    recommended_calories = models.IntegerField(null=True, validators=[MinValueValidator(0), MaxValueValidator(9999)])

#Ingredient is general for all other objects
class Ingredient(models.Model):
    name = models.CharField(max_length = 100)
    api_id = models.IntegerField(unique=True)
    calories_per_gram = models.FloatField()
    image = models.CharField(null=True, max_length=200)
    
    def __str__(self):
        return self.name


# RecipeIngredient is specific to a given recipe
class RecipeIngredient(models.Model):
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    metric_amount = models.FloatField(null=True)
    metric_unit = models.CharField(null=True, max_length=10)
    imperial_amount = models.FloatField(null=True)
    imperial_unit = models.CharField(null=True, max_length = 10)
    grams_amount = models.FloatField()
    def __str__(self):
        return self.ingredient.name    
    

class Recipe(models.Model):
    name = models.CharField(max_length = 100)
    api_id = models.IntegerField(null=True)
    url = models.CharField(max_length = 300)
    calories = models.FloatField(null=True)
    total_servings = models.IntegerField()
    recipe_ingredients = models.ManyToManyField(RecipeIngredient, related_name='recipes')
    image = models.CharField(null=True, max_length = 100)
    cuisine = models.CharField(null=True, max_length=20)
    credit = models.CharField(null=True, blank=True, max_length=100)
    vegan = models.BooleanField(default=False)
    vegetarian = models.BooleanField(default=False)
    ketogenic = models.BooleanField(default=False)
    gluten_free = models.BooleanField(default=False)
    dairy_free = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.name} ID: {self.pk}' 
    
    
    def list_ingredients(self):
        ingredient_list = []
        ingredients = self.recipe_ingredients.all()
        for recipe_ingredient in ingredients:
            ingredient = recipe_ingredient.ingredient
            print(ingredient.image)
            ingredient_list += [{
                "name": ingredient.name,
                "api_id": ingredient.api_id,
                "calories_per_gram": ingredient.calories_per_gram,
                "image": ingredient.image,
                "metric_amount": recipe_ingredient.metric_amount,
                "metric_unit": recipe_ingredient.metric_unit,
                "imperial_amount": recipe_ingredient.imperial_amount,
                "imperial_unit": recipe_ingredient.imperial_unit,
                "grams_amount": recipe_ingredient.grams_amount
            }]
        return ingredient_list
            


class MealComponent(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    servings = models.FloatField()


class Meal(models.Model):
    meal_type = models.CharField(max_length=10)
    components = models.ManyToManyField(MealComponent, related_name='meal')


class DailyPlan(models.Model):
    date = models.DateField()
    meals = models.ManyToManyField(Meal, related_name='day')
    
    def serialize(self):
        day = {}
        day['date'] = self.date
        for object in self.meals.all():
            meal = {}
            for component in object.components.all():
                recipe = component.recipe
                meal[f'{recipe.name}'] = {
                    'recipe_id': recipe.pk,
                    'servings': component.servings,
                    'calories': component.servings * (recipe.calories/recipe.total_servings)
                    
                }
            day[f'{object.meal_type}'] = meal
        return day

class Calendar(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='calendar')
    days = models.ManyToManyField(DailyPlan, related_name='parent_calendar')


class Like(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='likes')
    user = models.ManyToManyField(User, related_name='liked_recipes')
    
    @classmethod
    def add_like(cls, recipe, new_like):
        like_list, created = cls.objects.get_or_create(
            recipe=recipe
        )
        like_list.user.add(new_like)

    @classmethod
    def remove_like(cls, recipe, new_like):
        like_list, created = cls.objects.get_or_create(
            recipe=recipe
        )
        like_list.user.remove(new_like)

class Favorite(models.Model):
    recipe = models.ManyToManyField(Recipe, related_name='favorited_recipes')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites', null=True)
    
    @classmethod
    def add_favorite(cls, user, new_favorite):
        favorite_list, created = cls.objects.get_or_create(
            user=user
        )
        favorite_list.recipe.add(new_favorite)

    @classmethod
    def remove_favorite(cls, user, new_favorite):
        favorite_list, created = cls.objects.get_or_create(
            user=user
        )
        favorite_list.recipe.remove(new_favorite)