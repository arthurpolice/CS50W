from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Listing(models.Model):
    title = models.CharField(max_length=64)
    category = models.CharField(max_length=64)
    description = models.CharField(max_length=512, blank=True)
    quantity = models.IntegerField(max_length=2, default=1)
    buyout = models.FloatField(null=True)
    start_bid = models.FloatField()
    day = models.DateField(null=True)
    time = models.TimeField()
    status = models.CharField(max_length=6, default="Open")
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.title} ({self.status})"


class ListingImage(models.Model):
    listing = models.ForeignKey(
        Listing, on_delete=models.CASCADE, related_name="images")
    image_1 = models.CharField(max_length=512)
    image_2 = models.CharField(max_length=512)
    image_3 = models.CharField(max_length=512)
    image_4 = models.CharField(max_length=512)
    image_5 = models.CharField(max_length=512)


class Bid(models.Model):
    listing = models.ForeignKey(
        Listing, on_delete=models.CASCADE, related_name="bids")
    user = models.ForeignKey(
        User, on_delete=models.CASCADE)
    bid = models.FloatField()
    day = models.DateField()
    time = models.TimeField()
    
    def __str__(self):
        return f"{self.bid} by {self.user} on {self.listing}"


class ListingComment(models.Model):
    listing = models.ForeignKey(
        Listing, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(
        User, on_delete=models.CASCADE)
    day = models.DateField()
    time = models.TimeField()
    content = models.CharField(max_length=256)
    
    def __str__(self):
        return f"{self.user} on {self.listing}"

class Watchlist(models.Model):
    listing = models.ManyToManyField(Listing)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="owner")
    
    @classmethod
    def make_watchlist(cls, current_user, new_listing):
        watchlist, created = cls.objects.get_or_create(
            user = current_user
        )
        watchlist.listing.add(new_listing)