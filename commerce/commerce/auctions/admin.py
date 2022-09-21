from django.contrib import admin
from .models import Listings, ListingImages, Bids, Comments, User, Watchlist

# Register your models here.
admin.site.register(Listings)
admin.site.register(ListingImages)
admin.site.register(Bids)
admin.site.register(Comments)
admin.site.register(User)
admin.site.register(Watchlist)
