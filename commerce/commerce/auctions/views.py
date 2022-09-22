import datetime
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from .models import User, Listing, ListingImage, Watchlist, ListingComment, Bid
from .forms import ListingForm, PurchaseForm
from .util import log_listing, get_info, get_comments, bid_purchase_helper, watchlist_helper, categories, watchlist_checker


def index(request):
    listings = Listing.objects.filter(status="Open")
    list_of_info_dicts = get_info(listings)
    return render(request, "auctions/index.html", {
        "info": list_of_info_dicts,
        "header": "Active Listings"
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
        return HttpResponseRedirect(reverse("index"))
    else:
        listing_form = ListingForm()
        return render(request, "auctions/create.html", {
            "form": listing_form
        })


def listing_page(request, id, error=""):
    current_user = request.user
    listing = Listing.objects.filter(pk=id)
    info = get_info(listing)
    comments = get_comments(listing)
    watchlist_check = watchlist_checker(request, id)
    print(watchlist_check)
    return render(request, "auctions/listing_page.html", {
        "current_user": current_user,
        "info": info,
        "comments": comments,
        "purchase_form": PurchaseForm(),
        "error": error,
        "watchlist_check": watchlist_check
    })


@login_required
def save_to_watchlist(request):
    dict = watchlist_helper(request)
    Watchlist.make_watchlist(dict['current_user'], dict['listing'])
    return HttpResponseRedirect(reverse('listing_page', args=[dict['listing_id']]))

@login_required
def remove_from_watchlist(request):
    id = request.POST.get('listing_id')
    listing = Listing.objects.get(pk=id)
    Watchlist.objects.get(user=request.user, listing=listing).delete()
    return HttpResponseRedirect(reverse('listing_page', args=[id]))

@login_required
def display_watchlist(request):
    try:
        watchlist = Watchlist.objects.get(user = request.user)
        listings = watchlist.listing.all()
        list_of_info_dicts = get_info(listings)
        return render(request, "auctions/index.html", {
            "info": list_of_info_dicts,
            "header": "Watchlist"
        })
    except:
        return render(request, "auctions/index.html", {
        "header": "Watchlist"
    })


def get_categories(request):
       return render(request, "auctions/categories.html", {
        "categories": categories
   })


def display_category(request, category):
    listings = Listing.objects.filter(status="Open", category=category)
    list_of_info_dicts = get_info(listings)
    return render(request, "auctions/index.html", {
        "info": list_of_info_dicts,
        "header": "Category Listings"
    })

def search(request):
    return 0


def log_comment(request):
    current_user = request.user
    content = request.POST['comment_content']
    listing_id = request.POST['listing_id']
    listing = Listing.objects.get(pk=listing_id)
    day = datetime.datetime.utcnow().date()
    time = datetime.datetime.now(datetime.timezone.utc)
    comment = ListingComment(listing=listing, user=current_user,
                       content=content, day=day, time=time)
    comment.save()

    return HttpResponseRedirect(reverse('listing_page', args=[listing_id]))


def bid(request):
    listing_id = request.POST.get('listing_id')
    info = bid_purchase_helper(request)
    if info['new_bid'] >= info['buyout']:
        return buy(request)
    elif info['new_bid'] > info['highest_bid']:
        new_highest_bid = Bid(listing=info['listing'], user=info['current_user'],
                               bid=info['new_bid'], day=info['day'], time=info['time'])
        new_highest_bid.save()
        return HttpResponseRedirect(reverse('listing_page', args=[listing_id]))
    else:
        error = "Insufficient bid."
        return listing_page(request, listing_id, error)


def buy(request):
    info = bid_purchase_helper(request)
    bid = info['buyout']
    new_highest_bid = Bid(
        listing=info['listing'], user=info['current_user'], bid=bid, day=info['day'], time=info['time'])
    new_highest_bid.save()
    return close_listing(request)


def close_listing(request):
    listing_id = request.POST.get('listing_id')
    listing = Listing.objects.get(pk=listing_id)
    listing.status = "Closed"
    listing.save()
    return HttpResponseRedirect(reverse('listing_page', args=[listing_id]))