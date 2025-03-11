from django.db import models
from django.contrib.postgres.fields import ArrayField  # Only import ArrayField
from django.core.validators import MaxValueValidator, MinValueValidator
from markdownx.models import MarkdownxField

class Problem(models.Model):
    DIFFICULTY_CHOICES = [
        ('E', 'Easy'),
        ('M', 'Medium'),
        ('H', 'Hard')
    ]
    
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=200, unique=True)
    description = MarkdownxField(help_text="Problem description in Markdown format")
    difficulty = models.CharField(max_length=1, choices=DIFFICULTY_CHOICES)
    time_limit = models.IntegerField(help_text="Time limit in milliseconds")
    memory_limit = models.IntegerField(help_text="Memory limit in MB")
    likes = models.IntegerField(default=0)
    dislikes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_premium = models.BooleanField(default=False)
    acceptance_rate = models.FloatField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        default=0
    )
    related_problems = models.ManyToManyField(
        'self',
        blank=True,
        symmetrical=False,
        related_name='related_to'
    )

    solution = MarkdownxField(blank=True, null=True)
    
    topicTags = ArrayField(models.CharField(max_length=50), blank=True, default=list)
    hints = ArrayField(models.TextField(), blank=True, default=list)
    
    # Use JSONField from django.db.models instead
    default_code_templates = models.JSONField(default=dict, blank=True)
    
    def __str__(self):
        return self.title


class TestCase(models.Model):
     problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name='test_cases')
     input_data = models.TextField()
     expected_output = models.TextField()
     is_sample = models.BooleanField(default=False)
     explanation = MarkdownxField(blank=True, null=True)
     order = models.IntegerField(default=0)

     class Meta:
         ordering = ['order']