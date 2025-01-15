from django.db import models
from django.conf import settings

class CodeSubmission(models.Model):
    LANGUAGE_CHOICES = [
        ('PY', 'Python'),
        ('JS', 'JavaScript'),
        ('JAVA', 'Java'),
        ('CPP', 'C++'),
    ]

    STATUS_CHOICES = [
        ('AC', 'Accepted'),
        ('WA', 'Wrong Answer'),
        ('TLE', 'Time Limit Exceeded'),
        ('MLE', 'Memory Limit Exceeded'),
        ('RE', 'Runtime Error'),
        ('CE', 'Compilation Error')
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    problem = models.ForeignKey('problems.Problem', on_delete=models.CASCADE)
    code = models.TextField()
    language = models.CharField(max_length=10, choices=LANGUAGE_CHOICES)
    status = models.CharField(max_length=3, choices=STATUS_CHOICES)
    execution_time = models.IntegerField(null=True)
    memory_used = models.IntegerField(null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['user', 'problem', 'submitted_at'])
        ]