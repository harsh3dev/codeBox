# Generated by Django 5.1.6 on 2025-03-02 18:54

import markdownx.models
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('problems', '0010_problem_default_code_templates'),
    ]

    operations = [
        migrations.AddField(
            model_name='problem',
            name='solution',
            field=markdownx.models.MarkdownxField(blank=True, null=True),
        ),
    ]
