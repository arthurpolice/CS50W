from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('get_recipe/<int:id>', views.get_recipe, name="get_recipe"),
    path('extract_recipe', views.extract_recipe_from_url, name="extract_recipe"),
    path('add/custom_recipe', views.make_custom_recipe, name='make_custom_recipe'),
    path('get_daily_plan', views.get_daily_plan, name='get_daily_plan'),
    path('daily_plan/add', views.add_to_daily_plan, name='add_to_daily_plan'),
    path('daily_plan/remove', views.remove_from_daily_plan, name='remove_from_daily_plan'),
    path('favorites_handler', views.favorites_handler, name='favorites_handler'),
    path('likes_handler', views.likes_handler, name='likes_handler')  
]
