# Generated by Django 4.1.1 on 2022-09-21 20:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0002_bid_day_bid_time_listing_day_listing_time_and_more'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Bid',
            new_name='Bids',
        ),
    ]
