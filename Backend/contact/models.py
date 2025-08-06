from django.db import models
from django.core.validators import EmailValidator

class ContactMessage(models.Model):
    """Store contact form submissions"""
    SUBJECT_CHOICES = [
        ('general', 'General Inquiry'),
        ('adoption', 'Pet Adoption'),
        ('missing', 'Missing Pet Report'),
        ('shelter', 'Shelter Partnership'),
        ('donation', 'Donation Question'),
        ('volunteer', 'Volunteer Opportunity'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('new', 'New'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    
    # Contact information
    name = models.CharField(max_length=100)
    email = models.EmailField(validators=[EmailValidator()])
    phone = models.CharField(max_length=15, blank=True, null=True)
    
    # Message details
    subject = models.CharField(max_length=20, choices=SUBJECT_CHOICES, default='general')
    message = models.TextField()
    
    # Admin fields
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    admin_notes = models.TextField(blank=True, null=True, 
                                 help_text="Internal notes for admin use")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Contact from {self.name} - {self.get_subject_display()}"


class ContactInfo(models.Model):
    """Store organization contact information for footer/contact page"""
    organization_name = models.CharField(max_length=100, default="AdoptAPet Nepal")
    tagline = models.CharField(max_length=200, blank=True, null=True)
    
    # Contact details
    phone_primary = models.CharField(max_length=15)
    phone_secondary = models.CharField(max_length=15, blank=True, null=True)
    email_primary = models.EmailField()
    email_secondary = models.EmailField(blank=True, null=True)
    
    # Address
    address_line_1 = models.CharField(max_length=100)
    address_line_2 = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=50)
    district = models.CharField(max_length=50)
    province = models.CharField(max_length=50)
    postal_code = models.CharField(max_length=10, blank=True, null=True)
    
    # Social media
    facebook_url = models.URLField(blank=True, null=True)
    instagram_url = models.URLField(blank=True, null=True)
    twitter_url = models.URLField(blank=True, null=True)
    youtube_url = models.URLField(blank=True, null=True)
    
    # Operating hours
    office_hours = models.TextField(blank=True, null=True, 
                                  help_text="e.g., Mon-Fri: 9 AM - 6 PM")
    
    # Emergency contact
    emergency_phone = models.CharField(max_length=15, blank=True, null=True,
                                     help_text="24/7 emergency contact for lost pets")
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Contact Information"
        verbose_name_plural = "Contact Information"
    
    def __str__(self):
        return self.organization_name
    
    def save(self, *args, **kwargs):
        # Ensure only one active contact info exists
        if self.is_active:
            ContactInfo.objects.filter(is_active=True).update(is_active=False)
        super().save(*args, **kwargs)