import json
import validators
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.core.paginator import Paginator
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse

from .util import follow_status_check, get_avatar, get_comments, like_handler_post, like_handler_comment
from .models import Post, Comment, PostLike, CommentLike, User, ReplySection, Follower, Avatar


def index(request):
    if request.user.is_authenticated:
        return render(request, "network/index.html", {
            "called_page": "home"
        })
    else:
        return render(request, "network/index.html", {
            "called_page": "all_posts"
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
    if request.method != "POST" and request.method != "PUT":
        return JsonResponse({"error": "POST or PUT request required."}, status=400)
    data = json.loads(request.body)
    user = request.user
    content = data.get("content", "")
    image_url = data.get("picture", "")
    if validators.url(image_url) == False:
        image_url = None

    if request.method == "POST":
        post = Post(
            user=user,
            content=content,
            image_url=image_url
        )

        post.save()
        return JsonResponse({"message": "Post logged successfully."}, status=201)
    elif request.method == "PUT":
        id = data.get("id")
        post = Post.objects.get(pk=id)
        post.content = content
        post.image_url = image_url

        if post.user == request.user:
            post.save()
            return JsonResponse({"message": "Post edited successfully."}, status=201)
        else:
            return JsonResponse({"message": "Edit denied."}, status=401)


def homepage(request, page_num=1):
    if request.method == "POST":
        user = User.objects.get(pk=request.user.id)
        followed_users = user.following.all().values('user')
        users = User.objects.filter(id__in=followed_users)
        posts = Post.objects.filter(user__in=users)
        posts = posts.order_by("-timestamp")
        paginator = Paginator(posts, 10)
        page_contents = paginator.page(page_num)
        list_of_posts = [post.serialize(request.user)
                         for post in page_contents]
        return JsonResponse({"posts": list_of_posts,
                             "pages": paginator.num_pages,
                             "source": "homepage"
                             })
    else:
        return render(request, "network/index.html", {
            "called_page": "homepage"
        })


def all_posts(request, page_num=1):
    if request.method == "POST":
        posts = Post.objects.all()
        posts = posts.order_by("-timestamp")
        paginator = Paginator(posts, 10)
        page_contents = paginator.page(page_num)
        list_of_posts = [post.serialize(request.user)
                         for post in page_contents]
        return JsonResponse({"posts": list_of_posts,
                             "pages": paginator.num_pages,
                             "source": "all_posts"
                             })
    else:
        return render(request, "network/index.html", {
            "called_page": "all_posts"
        })


def profile_page(request, username, page_num=1):
    if request.method == "POST":
        requested_profile = User.objects.get(username=username)
        posts = Post.objects.filter(user=requested_profile)
        posts = posts.order_by("-timestamp")
        paginator = Paginator(posts, 10)
        page_contents = paginator.page(page_num)
        list_of_posts = [post.serialize(request.user)
                         for post in page_contents]
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
    follow_status = follow_status_check(request, requested_profile)
    avatar = get_avatar(requested_profile)
    follower_object = requested_profile.followers.get(user=requested_profile)
    follower_amount = follower_object.follower.all().count()
    followed_amount = requested_profile.following.all().values('user').count()

    user_dict = {
        "username": requested_profile.username,
        "join_date": requested_profile.date_joined.strftime("%B %Y"),
        "avatar": avatar,
        "follow_status": follow_status,
        "follower_amount": follower_amount,
        "followed_amount": followed_amount
    }
    return JsonResponse(user_dict)


@login_required
def follow(request, username):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    current_user = request.user
    followed_user = User.objects.get(username=username)

    if followed_user == current_user:
        return JsonResponse({"error": "You cannot follow yourself"}, status=201)

    try:
        if followed_user.followers.get(follower=current_user):
            Follower.remove_follower(followed_user, current_user)
            return JsonResponse({"message": "User unfollowed."}, status=201)
    except:
        Follower.add_follower(followed_user, current_user)
        return JsonResponse({"message": "Follow successful."}, status=201)


@login_required
def like(request, content_type, id):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    current_user = request.user
    if content_type == "post":
        liked_object = Post.objects.get(pk=id)
        like_handler_post(current_user, liked_object)
    elif content_type == "comment":
        liked_object = Comment.objects.get(pk=id)
        like_handler_comment(current_user, liked_object)
    return JsonResponse({"message": "Like action successful."}, status=201)


def single_post(request, id):
    if request.method == "POST":
        post = Post.objects.get(pk=id)
        post_info = post.serialize(request.user)
        comments = get_comments(request, post)
        print(comments)
        return JsonResponse({
            "post": post_info,
            "comments": comments,
            "current_user": request.user.username
        })


@login_required
def log_comment(request):
    if request.method != "POST" and request.method != "PUT":
        return JsonResponse({"error": "POST or PUT request required."}, status=400)
    data = json.loads(request.body)
    user = request.user
    content = data.get("content", "")
    image_url = data.get("picture", "")
    if validators.url(image_url) == False:
        image_url = None
    post_id = data.get("id")
    print(post_id)
    post = Post.objects.get(pk=post_id)
        
    if request.method == "POST":
        comment = Comment(
            user=user,
            content=content,
            image_url=image_url 
        )
        comment.save()
        ReplySection.add_comment(post, comment)
        return JsonResponse({'message': 'Comment successfully stored.'})
