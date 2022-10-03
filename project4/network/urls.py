
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("logpost", views.log_post, name="log_post"),
    path("homepage", views.homepage, name="homepage"),
    #route to get posts (for user's feed or someone else's page)
    #route to get specific post
    #route to like
    #route to comment
    #route to follow
    path("follow", views.follow, name="follow")
]
