# Generated by Django 5.1.6 on 2025-02-08 19:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('interview', '0003_remove_interviewsession_question_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='interviewsession',
            name='initial_prompt_sent',
            field=models.BooleanField(default=False),
        ),
    ]
