from django.contrib import admin
from .models import  Calendar, DailyPlan, Meal, User, MealComponent, Recipe, Ingredient, RecipeIngredient

# Register your models here.
admin.site.register(Calendar)
admin.site.register(DailyPlan)
admin.site.register(Meal)
admin.site.register(MealComponent)
admin.site.register(User)
admin.site.register(Recipe)
admin.site.register(Ingredient)
admin.site.register(RecipeIngredient)