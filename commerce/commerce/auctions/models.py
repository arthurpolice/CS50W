from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Listings(models.Model):
    title = models.CharField(max_length=64)
    category = models.CharField(max_length=64)
    description = models.CharField(max_length=512, blank=True)
    quantity = models.IntegerField(max_length=2, default=1)
    buyout = models.FloatField(null=True)
    start_bid = models.FloatField()
    listing_day = models.DateField()
    listing_time = models.TimeField()
    listing_status = models.CharField(max_length=6, default="Open")
    listing_owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="listing_owner")

    def __str__(self):
        return f"{self.title} ({self.listing_status})"


class Listing_images(models.Model):
    listing_images_id = models.ForeignKey(
        Listings, on_delete=models.CASCADE, related_name="images")
    image_1 = models.CharField(max_length=512)
    image_2 = models.CharField(max_length=512)
    image_3 = models.CharField(max_length=512)
    image_4 = models.CharField(max_length=512)
    image_5 = models.CharField(max_length=512)


class Bids(models.Model):
    listing_bid_id = models.ForeignKey(
        Listings, on_delete=models.CASCADE, related_name="bids")
    bid_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="bidding_users")
    bid = models.FloatField()
    bid_day = models.DateField()
    bid_time = models.TimeField()


class Comments(models.Model):
    listing_comment = models.ForeignKey(
        Listings, on_delete=models.CASCADE, related_name="comments")
    comment_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="commenting_users")
    comment_day = models.DateField()
    comment_time = models.TimeField()
    comment_content = models.CharField(max_length=256)


class Watch_list(models.Model):
    listing_watchlist = models.ForeignKey(
        Listings, on_delete=models.CASCADE, related_name="watchlist_occurrences")
    watchlist_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="watchlist_users")