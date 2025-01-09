from django.db import models
from markdownx.models import MarkdownxField

class ProblemTag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = MarkdownxField(blank=True)
    problems = models.ManyToManyField('coding_platform.Problem', related_name='tags')

    def __str__(self):
        return self.name
