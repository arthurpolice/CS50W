from django.contrib import admin
from .models import Listing, ListingImage, Bid, ListingComment, User, Watchlist

# Register your models here.
admin.site.register(Listing)
admin.site.register(ListingImage)
admin.site.register(Bid)
admin.site.register(ListingComment)
admin.site.register(User)
admin.site.register(Watchlist)
