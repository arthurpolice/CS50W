from django.contrib.auth.models import AbstractUser
from django.db import models
from django.forms import CharField


class User(AbstractUser):
    pass

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    content = models.CharField(max_length=255)
    image_url = models.CharField(null=True, max_length=255)
    day = models.DateField()
    time = models.TimeField()

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    content = models.CharField(max_length=255)
    image_url = models.CharField(null=True, max_length=255)
    day = models.DateField()
    time = models.TimeField()

class ReplySection(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="replies")
    comments = models.ManyToManyField(Comment, related_name="parent_post")
    
    @classmethod
    def make_reply_section(cls, post, new_comment):
        reply_section, created = cls.objects.get_or_create(
            post = post
        )
        reply_section.comments.add(new_comment)
        
class Follower(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name = "followers")
    follower = models.ManyToManyField(User, related_name="following")
    
    @classmethod
    def make_follower_list(cls, user, new_follower):
        follower_list, created = cls.objects.get_or_create(
            user = user
        )
        follower_list.follower.add(new_follower)
        
class PostLike(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likes")
    like = models.ManyToManyField(User, related_name="liked_post")
    
    @classmethod
    def make_like_list_post(cls, post, new_like):
        like_list, created = cls.objects.get_or_create(
            post = post
        )
        like_list.like.add(new_like)
        
class CommentLike(models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name="likes")
    like = models.ManyToManyField(User, related_name="liked_comment")
    
    @classmethod
    def make_like_list_post(cls, comment, new_like):
        like_list, created = cls.objects.get_or_create(
            comment = comment
        )
        like_list.like.add(new_like)