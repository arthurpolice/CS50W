from django.contrib.auth.models import AbstractUser
from django.db import models
from django.forms import CharField


class User(AbstractUser):
    pass

class Avatar(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="avatar")
    image_url = models.CharField(null=True, max_length=255)

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    content = models.CharField(max_length=255)
    image_url = models.CharField(null=True, max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def serialize(self):
        try:
            avatar = Avatar.objects.get(user=self.user)
            avatar = avatar.image_url
        except:
            avatar = None
        return {
            "user": self.user.username,
            "content": self.content,
            "image_url": self.image_url,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "avatar": avatar
        }

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    content = models.CharField(max_length=255)
    image_url = models.CharField(null=True, max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "user": self.user.username,
            "content": self.content,
            "image_url": self.image_url,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p")
        }

class ReplySection(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="replies")
    comments = models.ManyToManyField(Comment, related_name="parent_post")
    
    @classmethod
    def add_comment(cls, post, new_comment):
        reply_section, created = cls.objects.get_or_create(
            post = post
        )
        reply_section.comments.add(new_comment)
        
class Follower(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name = "followers")
    follower = models.ManyToManyField(User, related_name="following")
    timestamp = models.DateTimeField(auto_now_add=True)
    
    @classmethod
    def add_follower(cls, user, new_follower):
        follower_list, created = cls.objects.get_or_create(
            user = user
        )
        follower_list.follower.add(new_follower)
        
class PostLike(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likes")
    like = models.ManyToManyField(User, related_name="liked_post")
    timestamp = models.DateTimeField(auto_now_add=True)
    
    @classmethod
    def add_like_post(cls, post, new_like):
        like_list, created = cls.objects.get_or_create(
            post = post
        )
        like_list.like.add(new_like)
        
class CommentLike(models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name="likes")
    like = models.ManyToManyField(User, related_name="liked_comment")
    timestamp = models.DateTimeField(auto_now_add=True)
    
    @classmethod
    def add_like_comment(cls, comment, new_like):
        like_list, created = cls.objects.get_or_create(
            comment = comment
        )
        like_list.like.add(new_like)