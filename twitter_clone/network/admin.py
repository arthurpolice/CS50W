from django.contrib import admin
from .models import Post, Comment, PostLike, CommentLike, User, ReplySection, Follower, Avatar

# Register your models here.
admin.site.register(Follower)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(PostLike)
admin.site.register(CommentLike)
admin.site.register(User)
admin.site.register(ReplySection)
admin.site.register(Avatar)