
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("settings", views.settings_page, name="settings_page"),
    path("edit_profile", views.edit_profile, name="edit_profile"),
    path("edit_password", views.edit_password, name="edit_password"),
    path("logpost", views.log_post, name="log_post"),
    path("removepost/<int:id>", views.remove_post, name="remove_post"),
    path("logcomment", views.log_comment, name="log_comment"),
    path("removecomment/<int:id>", views.remove_comment, name="remove_comment"),
    path("homepage/<int:page_num>", views.homepage, name="homepage"),
    path("all_posts/<int:page_num>", views.all_posts, name="all_posts"),
    path("profile/<str:username>", views.profile_page, name="profile_page_simple"),
    path("profile/<str:username>/<int:page_num>", views.profile_page, name="profile_page"),
    path("user/<str:username>", views.user_info_profile, name="user_info_profile"),
    path("post/<int:id>", views.single_post, name="single_post"),
    path("like/<str:content_type>/<int:id>", views.like, name="like"),
    path("follow/<str:username>", views.follow, name="follow"),
    path("search/<str:username>", views.search, name="search")
]
