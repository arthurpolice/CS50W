from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("listings/<int:id>", views.listing_page, name="listing_page"),
    path("create", views.create_listing, name="create_listing"),
    path("edit", views.edit_listing, name="edit_listing"),
    path("watchlist", views.display_watchlist, name="watchlist"),
    path("categories", views.display_categories, name="categories"),
    path("search", views.search, name="search"),
    path("log_comment", views.log_comment, name="log_comment"),
    path('bid', views.bid, name='bid'),
    path('buy', views.buy, name='buy'),
    path('close_listing', views.close_listing, name='close_listing')
]
