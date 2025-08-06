# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom User model for Adopt Me pet adoption platform
    """
    
    # Contact Information
    email = models.EmailField(
        unique=True,
        help_text="User's email address for login"
    )
    
    phone_number = models.CharField(
        max_length=20,
        blank=True,
        help_text="Contact phone number"
    )
    
    # Profile Information
    location = models.CharField(
        max_length=200,
        blank=True,
        help_text="City or area where user lives"
    )
    
    bio = models.TextField(
        max_length=500,
        blank=True,
        help_text="Brief description about the user"
    )
    
    profile_picture = models.ImageField(
        upload_to='profiles/',
        blank=True,
        null=True,
        help_text="User's profile picture"
    )
    
    # Account Type
    is_shelter = models.BooleanField(
        default=False,
        help_text="True if user represents a pet shelter"
    )
    
    # Verification Status
    is_email_verified = models.BooleanField(
        default=False,
        help_text="Has user verified their email?"
    )
    
    is_phone_verified = models.BooleanField(
        default=False,
        help_text="Has user verified their phone?"
    )
    
    # Contact Preferences
    show_email_publicly = models.BooleanField(
        default=False,
        help_text="Show email in pet listings?"
    )
    
    show_phone_publicly = models.BooleanField(
        default=True,
        help_text="Show phone in pet listings?"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Use email as login field
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.username} ({self.email})"
    
    def get_display_name(self):
        """Get user's display name"""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        elif self.first_name:
            return self.first_name
        return self.username
    
    def get_contact_info(self):
        """Get contact info for pet listings"""
        contact = []
        if self.show_email_publicly and self.email:
            contact.append(f"Email: {self.email}")
        if self.show_phone_publicly and self.phone_number:
            contact.append(f"Phone: {self.phone_number}")
        return " | ".join(contact) if contact else "Contact via platform"
    
    def is_verified(self):
        """Check if user is verified"""
        return self.is_email_verified or self.is_phone_verified