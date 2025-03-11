"""CodeBox User Model"""
from django.contrib.auth.models import BaseUserManager, AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from datetime import datetime, timezone

class UserManager(BaseUserManager):
    def create_user(self, email, full_name, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, full_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, full_name, password, **extra_fields)

class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    username = None  # Disable username, use email for login
    google_id = models.CharField(max_length=255, unique=True, null=True)
    access_token = models.TextField(null=True, blank=True)
    refresh_token = models.TextField(null=True, blank=True)
    token_expiry = models.DateTimeField(null=True, blank=True)
    email = models.EmailField(_('email address'), unique=True)
    full_name = models.CharField(max_length=255, blank=True)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    github_profile = models.URLField(blank=True)
    linkedin_profile = models.URLField(blank=True)
    website = models.URLField(blank=True)

    # Activity tracking
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    objects = UserManager()

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def __str__(self):
        return self.email

    def update_tokens(self, access_token, refresh_token=None, expiry=None):
        self.access_token = access_token
        if refresh_token:
            self.refresh_token = refresh_token
        if expiry:
            self.token_expiry = expiry
        self.save()

    @property
    def token_expired(self):
        if self.token_expiry:
            return datetime.now(timezone.utc) >= self.token_expiry
        return True
