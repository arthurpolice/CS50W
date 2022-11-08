from django.contrib import admin
from django.urls import path
import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('get_recipe/<int:id>'),
    path('extract_recipe', views.extract_recipe_from_url, name='extract_recipe'),
    
]
