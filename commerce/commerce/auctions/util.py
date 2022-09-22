import datetime
from xml.etree.ElementTree import Comment
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from .models import User, Listing, ListingImage, Watchlist, ListingComment, Bid

# Function to extract information from the /create page and send it to the database.
def log_listing(request):
    current_user = request.user
    title = request.POST.get('title')
    starting_bid = request.POST.get('start_bid')
    buyout = request.POST.get('buyout').replace(",","")
    description = request.POST.get('description')
    category = request.POST.get('categories')
    image_1 = request.POST.get('image_1')
    image_2 = request.POST.get('image_2')
    image_3 = request.POST.get('image_3')
    image_4 = request.POST.get('image_4')
    image_5 = request.POST.get('image_5')
    day = datetime.datetime.utcnow().date()
    time = datetime.datetime.now(datetime.timezone.utc)
    # This try/except makes sure the function doesn't try to log a "" str in the buyout field, which raises an error.
    try:
        float(buyout)
    # If there is no numeric input from the buyout field, the function logs a None, which is accepted in the database
    # as the listing having no buyout, only bids.
    except:
        buyout = None
    
    listing = Listing(title=title, category=category, description=description,
                       buyout=buyout, start_bid=starting_bid, day=day,
                       time=time, owner=current_user)
    listing.save()

    listingImages = ListingImage(listing=listing, image_1=image_1, image_2=image_2,
                                    image_3=image_3, image_4=image_4, image_5=image_5)
    listingImages.save()

    return 0

# This function grabs information from the database about the listings contained in a QuerySet that is passed in.
# It then returns said information in a dictionary for the templates to use.
def get_info(listings):
    list_of_info_dicts = []
    for listing in listings:
        listingImages = listing.images.get()
        listing_dict = {
        'listing_owner': listing.owner,
        'listing_status': listing.status,
        'listing_day': listing.day,
        'listing_time': listing.time,
        'id': listing.id,
        'title': listing.title,
        'category': listing.category,
        'description': listing.description,
        'buyout': listing.buyout,
        'image_1': listingImages.image_1,
        'image_2': listingImages.image_2,
        'image_3': listingImages.image_3,
        'image_4': listingImages.image_4,
        'image_5': listingImages.image_5
        }
        # This try/except tries to grab the highest bid from the Bid table and returns the listing owner's starting bid if no bids exist.
        try:
            listing_bid = listing.bids.order_by('-bid')[0]
            bid = listing_bid.bid
            bidding_user = listing_bid.user
        except IndexError:
            bid = listing.start_bid
            bidding_user = None
        listing_dict['highest_bid'] = bid
        listing_dict['winning_user'] = bidding_user
        list_of_info_dicts += [listing_dict]
    return list_of_info_dicts

# This function gets comments from the database for the listing page. Returns a list of dictionaries with each comment being one.
def get_comments(listings):
    for listing in listings:
        list_of_comments = []
        # Setting the query in such a way that the most recent comment is on top.
        comments = listing.comments.all().order_by('-day', '-time')
        for comment in comments:
            author_id = comment.user
            author_username = User.objects.get(pk=author_id.id).username
            list_of_comments += [{
                "author": author_username,
                "comment": comment.content,
                "comment_day": comment.day,
                "comment_time": comment.time
            }]
    return list_of_comments

# Tuples for the value of the options in the select field of /create + the displayed name.
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

# This function returns a dictionary with the information needed to log a bid/purchase to the database.
def bid_purchase_helper(request):
    listing_id = request.POST.get('listing_id')
    try:
        buyout = float(request.POST.get('buyout'))
    except:
        buyout = None
    try:
        new_bid = float(request.POST.get('bid_field').replace(",",""))
    except:
        new_bid = None
    dict ={
    "buyout": buyout,
    "new_bid": new_bid,
    "listing": Listing.objects.get(pk=listing_id),
    "current_user": request.user,
    "highest_bid": float(request.POST.get('highest_bid')),
    "day": datetime.datetime.utcnow().date(),
    "time": datetime.datetime.now(datetime.timezone.utc)
    }
    return dict

# This function returns a dictionary with the information needed to log a watchlist entry to the database.
def watchlist_helper(request):
    listing_id = request.POST.get('listing_id')
    dict ={
    "listing_id": listing_id,
    "listing": Listing.objects.get(pk=listing_id),
    "current_user": request.user,
    "day": datetime.datetime.utcnow().date(),
    "time": datetime.datetime.now(datetime.timezone.utc)
    }
    return dict

# This function controls whether the listing is in the current user's watchlist or not, then changes the Watch/Unwatch button.
def watchlist_checker(request, id):
    listing = Listing.objects.get(pk=id)
    try:
        Watchlist.objects.get(user=request.user, listing=listing)
        return True
    except:
        return False