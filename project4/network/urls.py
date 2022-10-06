
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("logpost", views.log_post, name="log_post"),
    path("homepage/<int:page_num>", views.homepage, name="homepage"),
    path("profile/<str:username>", views.profile_page, name="profile_page_simple"),
    path("profile/<str:username>/<int:page_num>", views.profile_page, name="profile_page"),
    path("user/<str:username>", views.user_info, name="user_info"),
    #route to get specific post
    #route to like
    #route to comment
    path("follow/<str:username>", views.follow, name="follow")
]
