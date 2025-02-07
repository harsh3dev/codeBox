from django.db import models
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
    description = MarkdownxField(help_text="Problem description in Markdown format")
    input_format = MarkdownxField(help_text="Input format specification")
    output_format = MarkdownxField(help_text="Output format specification")
    constraints = MarkdownxField(help_text="Problem constraints")
    sample_explanation = MarkdownxField(help_text="Explanation of sample test cases")
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

    def __str__(self):
        return self.title

class ProblemHint(models.Model):
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name='hints')
    content = MarkdownxField()
    order = models.IntegerField(default=0)
    is_premium = models.BooleanField(default=False)

    class Meta:
        ordering = ['order']

class TestCase(models.Model):
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name='test_cases')
    input_data = models.TextField()
    expected_output = models.TextField()
    is_sample = models.BooleanField(default=False)
    explanation = MarkdownxField(blank=True, null=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']