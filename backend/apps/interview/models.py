from django.db import models
from django.utils import timezone
from apps.user.models import User
from apps.problems.models import Problem

class InterviewSession(models.Model):
    """Model representing an interview session with a user."""
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='interviews')
    question = models.ForeignKey(Problem, on_delete=models.CASCADE,null=True,blank=True) 
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)
    chat_history = models.JSONField(blank=True, default=list)
    ai_notes = models.TextField(blank=True, default="")

    class Meta:
        ordering = ['-start_time']

    def __str__(self):
        return f"Interview Session {self.id} - {self.user.email}"  # Using email instead of username

    def complete_interview(self):
        """Mark the interview as completed and set the end time."""
        self.is_completed = True
        self.end_time = timezone.now()
        self.save()

    def add_to_history(self, message: str, is_ai: bool = False):
        """Add a new message to the chat history as a JSON object."""
        self.chat_history.append({"is_ai": is_ai, "message": message})
        self.save()
