import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.core.paginator import Paginator
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from .models import Post, Comment, PostLike, CommentLike, User, ReplySection, Follower, Avatar


def follow_status_check(request, requested_profile):
    if requested_profile == request.user:
        follow_status = False
    else:
        # If this try succeeds, the requested profile is in the list of followed users.
        try:
            requested_profile.followers.get(follower=request.user)
            follow_status = True
        except:
            follow_status = False
        return follow_status


def get_avatar(requested_profile):
    # If this try succeeds, the user has an avatar.
    try:
        avatar = Avatar.objects.get(user=requested_profile)
        avatar = avatar.image_url
    except:
        avatar = None
    return avatar


def like_handler_post(current_user, liked_object):
    # If this try succeeds, the post was liked by the current user already. So that means the user is clicking the button to unlike.
    try:
        liked_object.likes.get(like=current_user)
        PostLike.remove_like_post(liked_object, current_user)
    except:
        PostLike.add_like_post(liked_object, current_user)


def like_handler_comment(current_user, liked_object):
        # If this try succeeds, the comment was liked by the current user already. So that means the user is clicking the button to unlike.
    try:
        liked_object.likes.get(like=current_user)
        CommentLike.remove_like_comment(liked_object, current_user)
    except:
        CommentLike.add_like_comment(liked_object, current_user)

# Returns the serialized list of comments related to a post.
def get_comments(request, post):
    # Get the ids from the many to many field.
    reply_section = post.replies.all().values('comments')
    # Use the ids to get the comments.
    comments = Comment.objects.filter(pk__in=reply_section)
    comments = comments.order_by("-timestamp")
    # serialize() returns a dictionary of relevant information about the comment.
    comments_list = [comment.serialize(request.user) for comment in comments]
    return comments_list
    