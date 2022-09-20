from django.contrib import admin
from .models import Listings, Listing_images, Bids, Comments, User, Watch_list

# Register your models here.
admin.site.register(Listings)
admin.site.register(Listing_images)
admin.site.register(Bids)
admin.site.register(Comments)
admin.site.register(User)
admin.site.register(Watch_list)
