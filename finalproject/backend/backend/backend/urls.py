from django.contrib import admin
from django.urls import path
from . import views
from .views import RegisterAPI
from knox import views as knox_views
from .views import LoginAPI

urlpatterns = [
    path('admin/', admin.site.urls),
    path('get_recipe/<int:id>', views.get_recipe, name="get_recipe"),
    path('get_all_recipes', views.get_all_recipes, name="get_all_recipes"),
    path('extract_recipe', views.extract_recipe_from_url, name="extract_recipe"),
    path('add/custom_recipe', views.make_custom_recipe, name='make_custom_recipe'),
    path('remove/recipe', views.remove_recipe, name='remove_recipe'),
    path('get_daily_plan', views.get_daily_plan, name='get_daily_plan'),
    path('daily_plan/add', views.add_to_daily_plan, name='add_to_daily_plan'),
    path('daily_plan/remove', views.remove_from_daily_plan, name='remove_from_daily_plan'),
    path('favorites_handler', views.favorites_handler, name='favorites_handler'),
    path('likes_handler', views.likes_handler, name='likes_handler'),
    path('get_all_ingredients', views.get_all_ingredients, name='get_all_ingredients'),
    path('get_all_measures', views.get_all_measures, name='get_all_measures'),
    path('log_custom', views.make_custom_recipe, name='make_custom_recipe'),
    path('register/', RegisterAPI.as_view(), name='register'),
    path('login', LoginAPI.as_view(), name='login'),
    path('logout', knox_views.LogoutView.as_view(), name='logout'),
    path('logoutall/', knox_views.LogoutAllView.as_view(), name='logoutall'),
    path('change_password', views.ChangePasswordView.as_view(), name='change_password'),
    path('check_token', views.check_token, name='check_token'),
]
