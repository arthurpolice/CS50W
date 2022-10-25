import json
import validators
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.core.paginator import Paginator
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse

from .util import get_comments, like_handler_post, like_handler_comment, user_info
from .models import Post, Comment, PostLike, CommentLike, User, ReplySection, Follower, Avatar


def index(request):
    if request.user.is_authenticated:
        return homepage(request)
    else:
        return all_posts(request)


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
def settings_page(request):
    username = request.user.username
    email = User.objects.get(pk=request.user.id).email
    user_dict = user_info(request, username)
    user_dict['email'] = email
    # Automatically fills the fields in the settings page.
    return JsonResponse(user_dict)

# This route is called from the settings page.


@login_required
def edit_profile(request):
    data = json.loads(request.body)
    current_user = User.objects.get(pk=request.user.id)
    username = data.get("username")
    avatar = data.get("avatar", "")
    email = data.get("email")

    current_user.username = username
    current_user.email = email

    try:
        avatar_object = Avatar.objects.get(user=current_user)
        avatar_object.image_url = avatar
    except:
        avatar_object = Avatar.objects.create(
            user=current_user, image_url=avatar)

    avatar_object.save()
    current_user.save()
    return JsonResponse({"message": "Profile successfully changed"})

# This route is called from the settings page.


@login_required
def edit_password(request):
    data = json.loads(request.body)
    password = data.get("old_password")
    # Check if the current password the user input is correct.
    user = authenticate(
        request, username=request.user.username, password=password)

    if user is not None:
        new_password = data.get("new_password")
        confirmation = data.get("confirmation")
        # Make sure the new password and confirmation fields match.
        if new_password == confirmation:
            user.password = make_password(new_password)
            user.save()
            return JsonResponse({"message": "Password successfully changed"})
    # If any of the checks fail, we send this error message to the page.
    return JsonResponse({"message": "Old password or confirmation wrong."})


@login_required
def homepage(request, page_num=1):
    # Returns the posts to be displayed to the javascript files.
    if request.method == "POST":
        # Gets the posts from users followed by the current user.
        user = User.objects.get(pk=request.user.id)
        # Using the related name "following" to get all the followed users.
        followed_users = user.following.all().values('user')
        # We then use the id of all the users found to get their posts in the next 2 lines.
        users = User.objects.filter(id__in=followed_users)
        posts = Post.objects.filter(user__in=users)
        posts = posts.order_by("-timestamp")
        # Breaks the list of posts into smaller lists of 10 posts.
        paginator = Paginator(posts, 10)
        # We send this information so we can make the navigation bar for the pages.
        page_contents = paginator.page(page_num)
        # serialize() returns a dictionary with information pertaining the post. It can be found in models.py.
        list_of_posts = [post.serialize(request.user)
                         for post in page_contents]
        return JsonResponse({"posts": list_of_posts,
                             "pages": paginator.num_pages,
                             "source": "homepage"
                             })
    # If the user accesses the page through GET request, we redirect him to a function that calls the function through POST request.
    # Why: to enable users to access different pages from this single page application through the URL.
    else:
        return render(request, "network/index.html", {
            "called_page": "homepage",
            "page": page_num
        })


def all_posts(request, page_num=1):
    # Returns the posts to be displayed to the javascript files.
    if request.method == "POST":
        # Get all posts indiscriminately for this page.
        posts = Post.objects.all()
        posts = posts.order_by("-timestamp")
        # Breaks the list of posts into smaller lists of 10 posts.
        paginator = Paginator(posts, 10)
        # We send this information so we can make the navigation bar for the pages.
        page_contents = paginator.page(page_num)
        # serialize() returns a dictionary with information pertaining the post. It can be found in models.py.
        list_of_posts = [post.serialize(request.user)
                         for post in page_contents]
        return JsonResponse({"posts": list_of_posts,
                             "pages": paginator.num_pages,
                             "source": "all_posts"
                             })
    # If the user accesses the page through GET request, we redirect him to a function that calls the function through POST request.
    # Why: to enable users to access different pages from this single page application through the URL.
    else:
        return render(request, "network/index.html", {
            "called_page": "all_posts",
            "page": page_num
        })


def profile_page(request, username, page_num=1):
    # Returns the posts to be displayed to the javascript files.
    if request.method == "POST":
        # Get all posts from the profile's owner.
        requested_profile = User.objects.get(username=username)
        posts = requested_profile.posts.all()
        posts = posts.order_by("-timestamp")
        # Breaks the list of posts into smaller lists of 10 posts.
        paginator = Paginator(posts, 10)
        # We send this information so we can make the navigation bar for the pages.
        page_contents = paginator.page(page_num)
        # serialize() returns a dictionary with information pertaining the post. It can be found in models.py.
        list_of_posts = [post.serialize(request.user)
                         for post in page_contents]
        return JsonResponse({"posts": list_of_posts,
                             "pages": paginator.num_pages,
                             "source": "profile_page",
                             "user": username
                             })
    # If the user accesses the page through GET request, we redirect him to a function that calls the function through POST request.
    # Why: to enable users to access different pages from this single page application through the URL.
    else:
        return render(request, "network/index.html", {
            "called_page": "profile",
            "username": username,
            "page": page_num
        })


# This function is called in conjunction with profile_page()
def user_info_profile(request, username):
    user_dict = user_info(request, username)
    return JsonResponse(user_dict)


def single_post(request, id):
    if request.method == "POST":
        post = Post.objects.get(pk=id)
        # serialize() returns a dictionary with information pertaining the post. It can be found in models.py.
        post_info = post.serialize(request.user)
        # get_comments() returns a serialized list of comments linked to this post. It can be found in util.py.
        comments = get_comments(request, post)
        return JsonResponse({
            "post": post_info,
            "comments": comments,
            "current_user": request.user.username
        })
    else:
        return render(request, 'network/index.html', {
            "called_page": "single_post",
            "id": id
        })


@login_required
def follow(request, username):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    current_user = request.user
    followed_user = User.objects.get(username=username)
    # This is just a safeguard, since the follow button is hidden in a user's own profile.
    if followed_user == current_user:
        return JsonResponse({"error": "You cannot follow yourself"}, status=201)
    # If this try succeeds, it means the function is being called from a profile that is already followed by the current_user, so we remove it.
    # If this try fails, it means the followed_user is not present in the current_user's list of followed profiles...
    try:
        if followed_user.followers.get(follower=current_user):
            Follower.remove_follower(followed_user, current_user)
            return JsonResponse({"message": "User unfollowed."}, status=201)
    # So we add them to that list.
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


@login_required
def log_post(request):
    # Just a safeguard, once the post input interface won't even load if the user isn't authenticated.
    if request.method != "POST" and request.method != "PUT":
        return JsonResponse({"error": "POST or PUT request required."}, status=400)
    data = json.loads(request.body)
    user = request.user
    content = data.get("content", "")
    image_url = data.get("picture", "")
    # Make sure the image_url is a valid url. Don't send it to the database if the check fails, to prevent unexpected behavior.
    if validators.url(image_url) == False:
        image_url = None
    # Method POST saves for the first time.
    if request.method == "POST":
        post = Post(
            user=user,
            content=content,
            image_url=image_url
        )

        post.save()
        return JsonResponse({"message": "Post logged successfully."}, status=201)
    # Method PUT updates.
    elif request.method == "PUT":
        id = data.get("id")
        post = Post.objects.get(pk=id)
        post.content = content
        post.image_url = image_url
        # Just a safeguard, once the edit button won't be clickable if the post doesn't belong to the current user.
        if post.user == request.user:
            post.save()
            return JsonResponse({"message": "Post edited successfully."}, status=201)
        else:
            return JsonResponse({"message": "Edit denied."}, status=401)


@login_required
def log_comment(request):
    # Just a safeguard, once the comment input interface won't even load if the user isn't authenticated.
    if request.method != "POST" and request.method != "PUT":
        return JsonResponse({"error": "POST or PUT request required."}, status=400)
    data = json.loads(request.body)
    user = request.user
    content = data.get("content", "")
    image_url = data.get("picture", "")
    # Make sure the image_url is a valid url. Don't send it to the database if the check fails, to prevent unexpected behavior.
    if validators.url(image_url) == False:
        image_url = None
    id = data.get("id")
    post = Post.objects.get(pk=id)
    # Method POST saves for the first time.
    if request.method == "POST":
        comment = Comment(
            user=user,
            content=content,
            image_url=image_url
        )
        comment.save()
        ReplySection.add_comment(post, comment)
        return JsonResponse({'message': 'Comment successfully stored.'})
    elif request.method == "PUT":
        comment = Comment.objects.get(pk=id)
        comment.content = content
        comment.image_url = image_url
        # Just a safeguard, once the edit button won't be clickable if the post doesn't belong to the current user.
        if comment.user == request.user:
            comment.save()
            return JsonResponse({"message": "Comment edited successfully"})

        return JsonResponse({"message": "You cannot edit someone else's comment!"})


def remove_post(request, id):
    if request.method == "POST":
        post = Post.objects.get(pk=id)
        if request.user == post.user:
            post.delete()
            return JsonResponse({"message": "Post deleted"})
        else:
            return JsonResponse({"message": "You cannot delete someone else's posts."})


def remove_comment(request, id):
    if request.method == "POST":
        comment = Comment.objects.get(pk=id)
    if request.user == comment.user:
        comment.delete()
        return JsonResponse({"message": "Comment deleted"})
    else:
        return JsonResponse({"message": "You cannot delete someone else's comment."})


def search(request, username):
    users = User.objects.filter(username__iregex=username)
    users = users.order_by("username")
    users = users[:5]
    list_of_matches = [user_info(request, user.username) for user in users]
    return JsonResponse({
        "matches": list_of_matches
    })
