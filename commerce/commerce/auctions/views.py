import datetime
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from .models import User, Listings, Listing_images, Watch_list, Comments, Bids
from .forms import ListingForm, PurchaseForm
from .util import log_listing, get_info, get_comments


def index(request):
    listings = Listings.objects.filter(listing_status="Open")
    # Make this a function in util
    list_of_info_dicts = get_info(listings)
    return render(request, "auctions/index.html", {
        "info": list_of_info_dicts
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
        listing_form = ListingForm()
        HttpResponseRedirect(reverse("index"))
    else:
        listing_form = ListingForm()
        return render(request, "auctions/create.html", {
            "form": listing_form
        })


@login_required
def edit_listing(request):
    return 0


def listing_page(request, id):
    current_user = request.user
    listing = Listings.objects.filter(pk=id)
    info = get_info(listing)
    comments = get_comments(listing)
    return render(request, "auctions/listing_page.html", {
        "current_user": current_user,
        "info": info,
        "comments": comments,
        "purchase_form": PurchaseForm()
    })


@login_required
def display_watchlist(request):
    return 0


def display_categories(request):
    return 0


def search(request):
    return 0

def log_comment(request):  
    current_user = request.user
    comment_content = request.POST['comment_content']
    listing_id = request.POST['listing_id']
    listing = Listings.objects.get(pk=listing_id)
    comment_day = datetime.datetime.utcnow().date()
    comment_time = datetime.datetime.now(datetime.timezone.utc)
    comment = Comments(listing_comment=listing, comment_user=current_user, comment_content=comment_content, comment_day=comment_day, comment_time=comment_time)
    comment.save()
    
    return HttpResponseRedirect(reverse('listing_page', args=[listing_id]))

def bid(request):
    return 0

def buy(request):
    return 0

def close_listing(request):
    return 0