from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('get_recipe/<int:id>', views.get_recipe, name="get_recipe"),
    path('extract_recipe', views.extract_recipe_from_url, name="extract_recipe"),
    
]
