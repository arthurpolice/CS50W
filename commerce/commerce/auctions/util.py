import datetime
from xml.etree.ElementTree import Comment
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from .models import User, Listing, ListingImage, Watchlist, ListingComment, Bid


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

    listing = Listing(title=title, category=category, description=description,
                       buyout=buyout, start_bid=starting_bid, day=day,
                       time=time, owner=current_user)
    listing.save()

    listingImages = ListingImage(listing=listing, image_1=image_1, image_2=image_2,
                                    image_3=image_3, image_4=image_4, image_5=image_5)
    listingImages.save()

    return 0


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


def get_comments(listings):
    for listing in listings:
        list_of_comments = []
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

def bid_purchase_helper(request):
    listing_id = request.POST.get('listing_id')
    dict ={
    "buyout": float(request.POST.get('buyout')),
    "new_bid": float(request.POST.get('bid_field')),
    "listing": Listing.objects.get(pk=listing_id),
    "current_user": request.user,
    "highest_bid": float(request.POST.get('highest_bid')),
    "day": datetime.datetime.utcnow().date(),
    "time": datetime.datetime.now(datetime.timezone.utc)
    }
    return dict


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

def watchlist_checker(request, id):
    listing = Listing.objects.get(pk=id)
    try:
        Watchlist.objects.get(user=request.user, listing=listing)
        return True
    except:
        return False