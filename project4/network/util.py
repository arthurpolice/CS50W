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
        try:
            requested_profile.followers.get(follower=request.user)
            follow_status = True
        except:
            follow_status = False
        return follow_status


def get_avatar(requested_profile):
    try:
        avatar = Avatar.objects.get(user=requested_profile)
        avatar = avatar.image_url
    except:
        avatar = None
    return avatar


def like_handler_post(current_user, liked_object):
    try:
        liked_object.likes.get(like=current_user)
        PostLike.remove_like_post(liked_object, current_user)
    except:
        PostLike.add_like_post(liked_object, current_user)


def like_handler_comment(current_user, liked_object):
    try:
        liked_object.likes.get(like=current_user)
        CommentLike.remove_like_comment(liked_object, current_user)
    except:
        CommentLike.add_like_comment(liked_object, current_user)

def get_comments(request, post):
    reply_section = post.replies.all().values('comments')
    comments = Comment.objects.filter(pk__in=reply_section)
    comments = comments.order_by("-timestamp")
    comments_list = [comment.serialize(request.user) for comment in comments]
    return comments_list
    