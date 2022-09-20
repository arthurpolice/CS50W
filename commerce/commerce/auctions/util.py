import datetime
from xml.etree.ElementTree import Comment
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from .models import User, Listings, Listing_images, Watch_list, Comments, Bids


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

    listing = Listings(title=title, category=category, description=description,
                       buyout=buyout, start_bid=starting_bid, listing_day=day,
                       listing_time=time, listing_owner=current_user)
    listing.save()

    listing_images = Listing_images(listing_images_id=listing, image_1=image_1, image_2=image_2,
                                    image_3=image_3, image_4=image_4, image_5=image_5)
    listing_images.save()

    return 0


def get_info(listings):
    list_of_info_dicts = []
    for listing in listings:
        listing_dict = {}
        listing_images = listing.images.get()
        listing_dict['listing_owner'] = listing.listing_owner
        listing_dict['id'] = listing.id
        listing_dict['title'] = listing.title
        listing_dict['category'] = listing.category
        listing_dict['description'] = listing.description
        listing_dict['buyout'] = listing.buyout
        listing_dict['image_1'] = listing_images.image_1
        listing_dict['image_2'] = listing_images.image_2
        listing_dict['image_3'] = listing_images.image_3
        listing_dict['image_4'] = listing_images.image_4
        listing_dict['image_5'] = listing_images.image_5
        try:
            listing_bid = listing.bids.order_by('bid')[0]
            bidding_user = listing_bid.bid_user
        except IndexError:
            listing_bid = listing.start_bid
            bidding_user = None
        listing_dict['highest_bid'] = listing_bid
        listing_dict['winning_user'] = bidding_user
        list_of_info_dicts += [listing_dict]
    return list_of_info_dicts


def get_comments(listings):
    for listing in listings:
        list_of_comments = []
        comments = listing.comments.all().order_by('-comment_day', '-comment_time')
        for comment in comments:
            author_id = comment.comment_user
            author_username = User.objects.get(pk=author_id.id).username
            list_of_comments += [{
                "author": author_username,
                "comment": comment.comment_content,
                "comment_day": comment.comment_day,
                "comment_time": comment.comment_time
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

