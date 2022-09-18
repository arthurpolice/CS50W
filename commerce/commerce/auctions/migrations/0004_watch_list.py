# Generated by Django 4.1.1 on 2022-09-17 18:45

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0003_listings_listing_status'),
    ]

    operations = [
        migrations.CreateModel(
            name='Watch_list',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('listing_watchlist', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='watchlist_item', to='auctions.listings')),
                ('watchlist_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='watchlist_user', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
