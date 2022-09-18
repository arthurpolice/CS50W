import datetime
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from .models import User, Listings, Listing_images, Watch_list, Comments, Bids

categories = [('motors', "Motors"),
              ("clothing", "Clothing"),
              ("electronics", "Electronics"),
              ("sporting", "Sporting Goods"),
              ("jewelry", "Jewelry"),
              ("colandart", "Collectibles & Art"),
              ("homeandgard", "Home & Garden"),
              ("business", "Business"),
              ("others", "Others")
              ]

def log_listing(request):
        current_user = request.user
        title = request.POST.get('title')
        starting_bid = request.POST.get('start_bid')
        buyout = request.POST.get('buyout')
        description = request.POST.get('description')
        category = request.POST.get('categories')
        image_1 = request.POST.get('image_1')
        image_2 = request.POST.get('image_2')
        image_3 = request.POST.get('image_3')
        image_4 = request.POST.get('image_4')
        image_5 = request.POST.get('image_5')
        day = datetime.datetime.utcnow().date()
        time = datetime.datetime.now(datetime.timezone.utc)
        
        listing = Listings(title = title, category = category, description = description,
                           buyout = buyout, start_bid = starting_bid, listing_day = day, 
                           listing_time = time, listing_owner = current_user)
        listing.save()
        
        listing_images = Listing_images(listing_images_id = listing, image_1 = image_1, image_2 = image_2,
                                        image_3 = image_3, image_4 = image_4, image_5 = image_5)
        listing_images.save()
        
        return 0