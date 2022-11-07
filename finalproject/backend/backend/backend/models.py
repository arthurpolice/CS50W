from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class CalorieAmount(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='calories')
    calories = models.IntegerField(null=True, max_legth=5)


#Produce is general for all other objects
class Produce:
    name = models.CharField(unique=True)
    api_id = models.IntegerField()
    calories_per_gram = models.FloatField()
    image = models.ImageField()


# Ingredient is specific to a certain recipe
class Ingredient:
    produce = models.ForeignKey(Produce)
    metric_amount = models.FloatField(null=True)
    metric_unit = models.CharField(null=True)
    imperial_amount = models.FloatField(null=True)
    imperial_unit = models.CharField(null=True)
    grams_amount = models.FloatField()
    

class Recipe(models.Model):
    name = models.CharField()
    api_id = models.IntegerField(null=True)
    url = models.CharField()
    calories = models.FloatField(null=True)
    total_servings = models.IntegerField()
    ingredients = models.ManyToManyField(Ingredient)
    image = models.CharField(null=True)


class MealComponent(models.Model):
    recipe = models.ForeignKey(Recipe)
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
        for object in self.meals:
            meal = {}
            for component in object.components:
                recipe = component.recipe
                meal[f"{recipe.name}"] = {
                    'recipe_id': recipe.pk,
                    'servings': component.servings,
                    'calories': component.servings * (recipe.calories/recipe.total_servings)
                    
                }
            day[f"{object.meal_type}"] = meal
        return day

class Calendar(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='calendar')
    days = models.ManyToManyField(DailyPlan, related_name='parent_calendar')