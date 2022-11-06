from django.contrib import admin
from .models import CalorieAmount, Calendar, DailyPlan, Meal, User, MealComponent, Recipe

# Register your models here.
admin.site.register(CalorieAmount)
admin.site.register(Calendar)
admin.site.register(DailyPlan)
admin.site.register(Meal)
admin.site.register(MealComponent)
admin.site.register(User)
admin.site.register(Recipe)