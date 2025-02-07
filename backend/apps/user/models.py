"""CodeBox User Model"""
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    username = None
    email = models.EmailField(_('email address'), unique=True)
    full_name = models.CharField(max_length=255, blank=True)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    github_profile = models.URLField(blank=True)
    linkedin_profile = models.URLField(blank=True)
    website = models.URLField(blank=True)
    # Platform specific fields
    reputation_points = models.IntegerField(default=0)
    problems_solved = models.IntegerField(default=0)
    easy_problems_solved = models.IntegerField(default=0)
    medium_problems_solved = models.IntegerField(default=0)
    hard_problems_solved = models.IntegerField(default=0)
    total_submissions = models.IntegerField(default=0)
    acceptance_rate = models.FloatField(default=0.0)
    
    # Activity tracking
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def __str__(self):
        return self.email