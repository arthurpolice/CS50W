import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from .models import Post, Comment, PostLike, CommentLike, User, ReplySection, Follower

from .models import User


def index(request):
    return render(request, "network/index.html")


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
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


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
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@login_required
def log_post(request):
    
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    data = json.loads(request.body)
    user = request.user
    content = data.get("content", "")
    image_url = data.get("picture", "")
    
    post = Post(
        user=user,
        content=content,
        image_url=image_url
    )
    
    post.save()
    return JsonResponse({"message": "Post logged successfully."}, status=201)

def homepage(request):
    # Not sure about this syntax
    followed_users = User.following.filter(user=request.user)
    posts = Post.objects.filter(user__in=followed_users)
    # Take these posts and send them to js to make the HTML

def profile_page(request, username):
    list_of_posts = []
    requested_profile = User.objects.get(username=username)
    posts = Post.objects.filter(user=requested_profile)
    # Figure out how to limit how many we go through and then start from that number again, it's in the classes
    for post in posts:
        dict = {
            "user": post.user,
            "content": post.content,
            "image": post.image_url,
            "timestamp": post.timestamp
        }
        
def follow(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    data = json.loads(request.body)
    current_user = request.user
    followed_user = data.user
    Follower.add_follower(followed_user, current_user)
    return JsonResponse({"message": "Follow successful."}, status=201)