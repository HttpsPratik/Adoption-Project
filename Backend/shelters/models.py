
from django.db import models
from django.conf import settings
from django.core.validators import URLValidator


class Shelter(models.Model):
    """
    Shelter/Rescue Organization model
    Extends the User model for organizations
    """
    
    # Shelter Types
    SHELTER_TYPE_CHOICES = [
        ('animal_shelter', 'Animal Shelter'),
        ('rescue_organization', 'Rescue Organization'),
        ('sanctuary', 'Animal Sanctuary'),
        ('foster_network', 'Foster Network'),
        ('veterinary_clinic', 'Veterinary Clinic'),
        ('other', 'Other'),
    ]
    
    # Verification Status
    VERIFICATION_STATUS_CHOICES = [
        ('pending', 'Pending Verification'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
        ('suspended', 'Suspended'),
    ]
    
    # Basic Information
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='shelter_profile',
        help_text="User account associated with this shelter"
    )
    
    name = models.CharField(
        max_length=200,
        help_text="Official shelter/organization name"
    )
    
    shelter_type = models.CharField(
        max_length=30,
        choices=SHELTER_TYPE_CHOICES,
        help_text="Type of organization"
    )
    
    registration_number = models.CharField(
        max_length=100,
        blank=True,
        help_text="Official registration/license number"
    )
    
    # Contact Information
    address = models.TextField(
        help_text="Complete address of the shelter"
    )
    
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default='USA')
    
    phone_primary = models.CharField(
        max_length=20,
        help_text="Primary contact number"
    )
    
    phone_secondary = models.CharField(
        max_length=20,
        blank=True,
        help_text="Secondary contact number"
    )
    
    email_primary = models.EmailField(
        help_text="Primary contact email"
    )
    
    email_secondary = models.EmailField(
        blank=True,
        help_text="Secondary contact email"
    )
    
    # Online Presence
    website = models.URLField(
        blank=True,
        help_text="Shelter website URL"
    )
    
    facebook_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    
    # Operational Information
    description = models.TextField(
        help_text="Description of the shelter and its mission"
    )
    
    mission_statement = models.TextField(
        blank=True,
        help_text="Organization's mission statement"
    )
    
    services_offered = models.TextField(
        help_text="Services offered (adoption, spay/neuter, etc.)"
    )
    
    # Operating Hours
    operating_hours = models.JSONField(
        default=dict,
        blank=True,
        help_text="Operating hours for each day of the week"
    )
    
    # Capacity and Statistics
    total_capacity = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Total capacity for animals"
    )
    
    current_animal_count = models.PositiveIntegerField(
        default=0,
        help_text="Current number of animals"
    )
    
    total_adoptions = models.PositiveIntegerField(
        default=0,
        help_text="Total successful adoptions"
    )
    
    # Verification and Status
    verification_status = models.CharField(
        max_length=20,
        choices=VERIFICATION_STATUS_CHOICES,
        default='pending',
        help_text="Verification status"
    )
    
    verified_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When the shelter was verified"
    )
    
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='verified_shelters',
        help_text="Admin who verified this shelter"
    )
    
    # Settings
    is_active = models.BooleanField(
        default=True,
        help_text="Is this shelter currently active?"
    )
    
    accepts_donations = models.BooleanField(
        default=True,
        help_text="Does this shelter accept donations?"
    )
    
    allows_volunteers = models.BooleanField(
        default=True,
        help_text="Does this shelter accept volunteers?"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Shelter"
        verbose_name_plural = "Shelters"
        ordering = ['name']
        indexes = [
            models.Index(fields=['city', 'state']),
            models.Index(fields=['verification_status']),
            models.Index(fields=['shelter_type']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.city}, {self.state})"
    
    def get_full_address(self):
        """Get formatted full address"""
        return f"{self.address}, {self.city}, {self.state} {self.postal_code}, {self.country}"
    
    def get_contact_info(self):
        """Get formatted contact information"""
        contact = []
        contact.append(f"Phone: {self.phone_primary}")
        if self.phone_secondary:
            contact.append(f"Alt Phone: {self.phone_secondary}")
        contact.append(f"Email: {self.email_primary}")
        if self.email_secondary:
            contact.append(f"Alt Email: {self.email_secondary}")
        return " | ".join(contact)
    
    def get_social_media_links(self):
        """Get social media links"""
        links = {}
        if self.facebook_url:
            links['facebook'] = self.facebook_url
        if self.instagram_url:
            links['instagram'] = self.instagram_url
        if self.twitter_url:
            links['twitter'] = self.twitter_url
        if self.website:
            links['website'] = self.website
        return links
    
    @property
    def is_verified(self):
        """Check if shelter is verified"""
        return self.verification_status == 'verified'
    
    @property
    def occupancy_rate(self):
        """Calculate occupancy rate as percentage"""
        if self.total_capacity and self.total_capacity > 0:
            return (self.current_animal_count / self.total_capacity) * 100
        return 0


class ShelterImage(models.Model):
    """
    Images for shelters (facility photos, etc.)
    """
    shelter = models.ForeignKey(
        Shelter,
        on_delete=models.CASCADE,
        related_name='images'
    )
    
    image = models.ImageField(
        upload_to='shelters/%Y/%m/',
        help_text="Shelter photo"
    )
    
    caption = models.CharField(
        max_length=200,
        blank=True,
        help_text="Caption describing the image"
    )
    
    image_type = models.CharField(
        max_length=20,
        choices=[
            ('exterior', 'Exterior View'),
            ('interior', 'Interior View'),
            ('facility', 'Facility'),
            ('animals', 'Animals at Shelter'),
            ('staff', 'Staff/Volunteers'),
            ('events', 'Events'),
            ('other', 'Other'),
        ],
        default='facility'
    )
    
    is_primary = models.BooleanField(
        default=False,
        help_text="Is this the main shelter image?"
    )
    
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Shelter Image"
        verbose_name_plural = "Shelter Images"
        ordering = ['-is_primary', '-uploaded_at']
    
    def __str__(self):
        return f"Image for {self.shelter.name}"


class ShelterReview(models.Model):
    """
    Reviews and ratings for shelters
    """
    shelter = models.ForeignKey(
        Shelter,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='shelter_reviews'
    )
    
    rating = models.PositiveIntegerField(
        choices=[(i, i) for i in range(1, 6)],
        help_text="Rating from 1 to 5 stars"
    )
    
    title = models.CharField(
        max_length=200,
        help_text="Review title"
    )
    
    comment = models.TextField(
        help_text="Detailed review comment"
    )
    
    experience_type = models.CharField(
        max_length=20,
        choices=[
            ('adoption', 'Adoption Experience'),
            ('volunteer', 'Volunteer Experience'),
            ('donation', 'Donation Experience'),
            ('visit', 'Facility Visit'),
            ('other', 'Other'),
        ],
        default='adoption'
    )
    
    is_verified_adopter = models.BooleanField(
        default=False,
        help_text="Is this reviewer a verified adopter?"
    )
    
    is_approved = models.BooleanField(
        default=True,
        help_text="Is this review approved for display?"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['shelter', 'reviewer']
        verbose_name = "Shelter Review"
        verbose_name_plural = "Shelter Reviews"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Review for {self.shelter.name} by {self.reviewer.username}"


class ShelterVolunteer(models.Model):
    """
    Track volunteer applications and assignments
    """
    shelter = models.ForeignKey(
        Shelter,
        on_delete=models.CASCADE,
        related_name='volunteers'
    )
    
    volunteer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='volunteer_applications'
    )
    
    status = models.CharField(
        max_length=20,
        choices=[
            ('applied', 'Applied'),
            ('approved', 'Approved'),
            ('active', 'Active Volunteer'),
            ('inactive', 'Inactive'),
            ('rejected', 'Rejected'),
        ],
        default='applied'
    )
    
    skills = models.TextField(
        blank=True,
        help_text="Volunteer's skills and experience"
    )
    
    availability = models.TextField(
        blank=True,
        help_text="Volunteer's availability schedule"
    )
    
    emergency_contact = models.CharField(
        max_length=200,
        blank=True,
        help_text="Emergency contact information"
    )
    
    background_check_completed = models.BooleanField(
        default=False,
        help_text="Has background check been completed?"
    )
    
    orientation_completed = models.BooleanField(
        default=False,
        help_text="Has volunteer orientation been completed?"
    )
    
    start_date = models.DateField(
        null=True,
        blank=True,
        help_text="Date volunteer started"
    )
    
    total_hours = models.PositiveIntegerField(
        default=0,
        help_text="Total volunteer hours logged"
    )
    
    notes = models.TextField(
        blank=True,
        help_text="Notes about the volunteer"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['shelter', 'volunteer']
        verbose_name = "Shelter Volunteer"
        verbose_name_plural = "Shelter Volunteers"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.volunteer.get_display_name()} - {self.shelter.name}"