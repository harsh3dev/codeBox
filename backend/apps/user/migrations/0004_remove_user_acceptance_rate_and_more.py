# Generated by Django 5.1.6 on 2025-02-11 17:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_user_access_token_user_google_id_user_refresh_token_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='acceptance_rate',
        ),
        migrations.RemoveField(
            model_name='user',
            name='easy_problems_solved',
        ),
        migrations.RemoveField(
            model_name='user',
            name='hard_problems_solved',
        ),
        migrations.RemoveField(
            model_name='user',
            name='medium_problems_solved',
        ),
        migrations.RemoveField(
            model_name='user',
            name='problems_solved',
        ),
        migrations.RemoveField(
            model_name='user',
            name='reputation_points',
        ),
        migrations.RemoveField(
            model_name='user',
            name='total_submissions',
        ),
    ]
