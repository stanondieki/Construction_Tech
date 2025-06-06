from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    """
    Custom User model for UjenziIQ platform
    Extends Django's AbstractUser to add fields specific to construction
    stakeholders including contractors, engineers, project managers, etc.
    """
    # User types
    USER_TYPE_CHOICES = (
        ('admin', 'Administrator'),
        ('project_manager', 'Project Manager'),
        ('site_engineer', 'Site Engineer'),
        ('contractor', 'Contractor'),
        ('foreman', 'Foreman'),
        ('worker', 'Worker'),
        ('client', 'Client'),
        ('supplier', 'Supplier'),
    )
    
    email = models.EmailField(_('email address'), unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='worker')
    organization = models.CharField(max_length=100, blank=True, null=True)
    position = models.CharField(max_length=100, blank=True, null=True)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    
    # SMS notifications for users without smartphones
    receive_sms_notifications = models.BooleanField(default=False)
    
    # Required fields when creating a user are:
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.get_user_type_display()})"
