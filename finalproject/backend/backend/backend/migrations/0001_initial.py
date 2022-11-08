# Generated by Django 4.1.2 on 2022-11-08 16:22

from django.conf import settings
import django.contrib.auth.models
import django.contrib.auth.validators
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('recommended_calories', models.IntegerField(null=True, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(9999)])),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Ingredient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('api_id', models.IntegerField(unique=True)),
                ('calories_per_gram', models.FloatField()),
                ('image', models.ImageField(upload_to='')),
            ],
        ),
        migrations.CreateModel(
            name='RecipeIngredient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('metric_amount', models.FloatField(null=True)),
                ('metric_unit', models.CharField(max_length=10, null=True)),
                ('imperial_amount', models.FloatField(null=True)),
                ('imperial_unit', models.CharField(max_length=10, null=True)),
                ('grams_amount', models.FloatField()),
                ('produce', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.ingredient')),
            ],
        ),
        migrations.CreateModel(
            name='Recipe',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('api_id', models.IntegerField(null=True)),
                ('url', models.CharField(max_length=300)),
                ('calories', models.FloatField(null=True)),
                ('total_servings', models.IntegerField()),
                ('image', models.CharField(max_length=100, null=True)),
                ('ingredients', models.ManyToManyField(related_name='recipes', to='backend.recipeingredient')),
            ],
        ),
        migrations.CreateModel(
            name='MealComponent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('servings', models.FloatField()),
                ('recipe', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.recipe')),
            ],
        ),
        migrations.CreateModel(
            name='Meal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('meal_type', models.CharField(max_length=10)),
                ('components', models.ManyToManyField(related_name='meal', to='backend.mealcomponent')),
            ],
        ),
        migrations.CreateModel(
            name='Like',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('recipe', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='likes', to='backend.recipe')),
                ('user', models.ManyToManyField(related_name='liked_recipes', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Favorite',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('recipe', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='favorites', to='backend.recipe')),
                ('user', models.ManyToManyField(related_name='favorited_recipes', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='DailyPlan',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('meals', models.ManyToManyField(related_name='day', to='backend.meal')),
            ],
        ),
        migrations.CreateModel(
            name='Calendar',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('days', models.ManyToManyField(related_name='parent_calendar', to='backend.dailyplan')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='calendar', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]