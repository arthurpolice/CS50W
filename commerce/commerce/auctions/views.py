import datetime
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from .models import User, Listings, Listing_images, Watch_list, Comments, Bids
from .forms import ListingForm
from .util import log_listing

def index(request):
    listings = Listings.objects.filter(listing_status="Open")
    # Make this a function in util
    list_of_image_dicts = []
    for listing in listings:
        listing_images = listing.images.all()
        for image_set in listing_images:
            image_dict = {}
            image_dict['listing_id'] = listing.id
            image_dict['image_1'] = image_set.image_1
            image_dict['image_2'] = image_set.image_2
            image_dict['image_3'] = image_set.image_3
            image_dict['image_4'] = image_set.image_4
            image_dict['image_5'] = image_set.image_5
            list_of_image_dicts += [image_dict]
            break
    return render(request, "auctions/index.html", {
        "listings": listings,
        "images": list_of_image_dicts
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")

@login_required
def create_listing(request):
    if request.method == "POST":
        log_listing(request)
        # CHANGE THIS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        # !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        listing_form = ListingForm()        
        return render(request, "auctions/create.html", {
            "form": listing_form
        })
    else:
        listing_form = ListingForm()
        return render(request, "auctions/create.html", {
            "form": listing_form
        })

@login_required
def edit_listing(request):
    return 0

def listing_page(request):
    return 0

@login_required
def display_watchlist(request):
    return 0

def display_categories(request):
    return 0

def search(request):
    return 0