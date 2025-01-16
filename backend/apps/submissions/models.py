from django.db import models

class CodeSubmission(models.Model):
    LANGUAGE_CHOICES = [
        ('PY', 'Python'),
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

    code = models.TextField()
    language = models.CharField(max_length=10, choices=LANGUAGE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='CE')  
    execution_time = models.IntegerField(null=True)
    memory_used = models.IntegerField(null=True)
    test_cases = models.JSONField()

    class Meta:
        indexes = [
            models.Index(fields=['status'])
        ]
