# pets/models.py - Fixed version with proper User model reference

from django.db import models
from django.conf import settings  # Import settings
from django.utils import timezone

class Pet(models.Model):
    # Pet status choices
    STATUS_CHOICES = [
        ('available', 'Available for Adoption'),
        ('adopted', 'Adopted'),
        ('missing', 'Missing'),
        ('found', 'Found'),
        ('fostered', 'In Foster Care'),
    ]
    
    # Pet types
    PET_TYPE_CHOICES = [
        ('dog', 'Dog'),
        ('cat', 'Cat'),
        ('bird', 'Bird'),
        ('rabbit', 'Rabbit'),
        ('other', 'Other'),
    ]
    
    # Size choices
    SIZE_CHOICES = [
        ('small', 'Small'),
        ('medium', 'Medium'),
        ('large', 'Large'),
        ('extra_large', 'Extra Large'),
    ]
    
    # Gender choices
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('unknown', 'Unknown'),
    ]
    
    # Nepal provinces
    PROVINCE_CHOICES = [
        ('province_1', 'Province 1'),
        ('madhesh', 'Madhesh Province'),
        ('bagmati', 'Bagmati Province'),
        ('gandaki', 'Gandaki Province'),
        ('lumbini', 'Lumbini Province'),
        ('karnali', 'Karnali Province'),
        ('sudurpashchim', 'Sudurpashchim Province'),
    ]
    
    # Basic pet information
    name = models.CharField(max_length=100)
    pet_type = models.CharField(max_length=20, choices=PET_TYPE_CHOICES, default='dog')
    breed = models.CharField(max_length=100, blank=True, null=True)
    age = models.PositiveIntegerField(help_text="Age in months")
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='unknown')
    size = models.CharField(max_length=15, choices=SIZE_CHOICES, default='medium')
    color = models.CharField(max_length=50, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    
    # Health information
    is_vaccinated = models.BooleanField(default=False)
    is_neutered = models.BooleanField(default=False)
    health_status = models.TextField(blank=True, null=True, help_text="Any health conditions or notes")
    
    # Nepal-specific location fields
    province = models.CharField(max_length=20, choices=PROVINCE_CHOICES)
    district = models.CharField(max_length=50)
    city = models.CharField(max_length=50)
    detailed_address = models.TextField(blank=True, null=True, help_text="Detailed address or landmark")
    
    # Status and availability
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    is_active = models.BooleanField(default=True)
    
    # Missing pet specific fields
    last_seen_location = models.CharField(max_length=200, blank=True, null=True, 
                                        help_text="Last known location for missing pets")
    last_seen_date = models.DateTimeField(blank=True, null=True)
    reward_offered = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True,
                                       help_text="Reward amount in NPR")
    contact_phone = models.CharField(max_length=15, blank=True, null=True)
    contact_email = models.EmailField(blank=True, null=True)
    
    # FIXED: Use settings.AUTH_USER_MODEL instead of User directly
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='pets')
    
    # Media
    image = models.ImageField(upload_to='pets/', blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.get_pet_type_display()})"
    
    @property
    def is_missing(self):
        return self.status == 'missing'
    
    @property
    def is_available_for_adoption(self):
        return self.status == 'available' and self.is_active
    
    @property
    def location_display(self):
        return f"{self.city}, {self.district}, {self.get_province_display()}"