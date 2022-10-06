import json
import validators
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.core.paginator import Paginator
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from .models import Post, Comment, PostLike, CommentLike, User, ReplySection, Follower, Avatar


def index(request):
    return render(request, "network/index.html", {
        "called_page": "home"
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
    if validators.url(image_url) == False:
        image_url = None
       
    post = Post(
        user=user,
        content=content,
        image_url=image_url
    )
    
    post.save()
    return JsonResponse({"message": "Post logged successfully."}, status=201)

# TODO: make behavior for people who are not signed in
def homepage(request, page_num=1):
    # Not sure about this syntax
    user = User.objects.get(pk=request.user.id)
    followed_users = user.following.all().values('user')
    print(followed_users)
    users = User.objects.filter(id__in=followed_users)
    posts = Post.objects.filter(user__in = users)
    posts = posts.order_by("-timestamp")
    paginator = Paginator(posts, 10)
    page_contents = paginator.page(page_num)
    list_of_posts = [post.serialize() for post in page_contents]
    return JsonResponse({"posts": list_of_posts,
                         "pages": paginator.num_pages,
                         "source": "homepage"
                         })


def profile_page(request, username, page_num=1):
    if request.method == "POST":
        requested_profile = User.objects.get(username=username)
        posts = Post.objects.filter(user=requested_profile)
        posts = posts.order_by("-timestamp")
        paginator = Paginator(posts, 10)
        page_contents = paginator.page(page_num)
        list_of_posts = [post.serialize() for post in page_contents]
        print(paginator.num_pages)
        return JsonResponse({"posts": list_of_posts,
                             "pages": paginator.num_pages,
                             "source": "profile_page",
                             "user": username
                             })
    else:
        return render(request, "network/index.html", {
            "called_page": "profile",
            "username": username
        })


def user_info(request, username):
    requested_profile = User.objects.get(username=username)
    if requested_profile == request.user:
        follow_status = False
    elif requested_profile.followers.get(follower = request.user):
        follow_status = True
    else:
        follow_status = False
    
    try:
        avatar = Avatar.objects.get(user = requested_profile)
        avatar = avatar.image_url
    except:
        avatar = None
    
    user_dict = {
        "username": requested_profile.username,
        "join_date": requested_profile.date_joined.strftime("%B %Y"),
        "avatar": avatar,
        "follow_status": follow_status
    }
    return JsonResponse(user_dict)
    
@login_required
def follow(request, username):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    current_user = request.user
    followed_user = User.objects.get(username = username)
    if followed_user == current_user:
        return JsonResponse({"error": "You cannot follow yourself"}, status=201)
    if followed_user.followers.get(follower = current_user):
        Follower.remove_follower(followed_user, current_user)
    Follower.add_follower(followed_user, current_user)
    return JsonResponse({"message": "Follow successful."}, status=201)