from django.db import models
from apps.user.models import User  
from apps.problems.models import Problem

class InterviewSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ManyToManyField(Problem)  
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return f"Interview Session {self.id} by {self.user.username}"