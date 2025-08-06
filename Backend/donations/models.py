
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from decimal import Decimal


class Donation(models.Model):
    """
    Main donation model for tracking donations to shelters and platform
    """
    
    # Donation Types
    DONATION_TYPE_CHOICES = [
        ('shelter', 'Shelter Donation'),
        ('platform', 'Platform Support'),
        ('emergency', 'Emergency Fund'),
        ('general', 'General Animal Welfare'),
    ]
    
    # Payment Status
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
        ('cancelled', 'Cancelled'),
    ]
    
    # Payment Methods
    PAYMENT_METHOD_CHOICES = [
        ('credit_card', 'Credit Card'),
        ('debit_card', 'Debit Card'),
        ('paypal', 'PayPal'),
        ('bank_transfer', 'Bank Transfer'),
        ('mobile_payment', 'Mobile Payment'),
        ('other', 'Other'),
    ]
    
    # Basic Information
    donor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='donations',
        help_text="User who made the donation (null for anonymous donations)"
    )
    
    # Anonymous donor information
    anonymous_donor_name = models.CharField(
        max_length=100,
        blank=True,
        help_text="Name for anonymous donations"
    )
    
    anonymous_donor_email = models.EmailField(
        blank=True,
        help_text="Email for anonymous donations"
    )
    
    # Donation Details
    donation_type = models.CharField(
        max_length=20,
        choices=DONATION_TYPE_CHOICES,
        help_text="Type of donation"
    )
    
    shelter = models.ForeignKey(
        'shelters.Shelter',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='donations',
        help_text="Shelter receiving the donation (null for platform donations)"
    )
    
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Donation amount"
    )
    
    currency = models.CharField(
        max_length=3,
        default='USD',
        help_text="Currency code (USD, EUR, etc.)"
    )
    
    # Payment Information
    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD_CHOICES,
        help_text="Payment method used"
    )
    
    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default='pending',
        help_text="Current payment status"
    )
    
    transaction_id = models.CharField(
        max_length=100,
        blank=True,
        help_text="External payment processor transaction ID"
    )
    
    payment_processor = models.CharField(
        max_length=50,
        blank=True,
        help_text="Payment processor used (Stripe, PayPal, etc.)"
    )
    
    # Additional Information
    message = models.TextField(
        blank=True,
        help_text="Optional message from donor"
    )
    
    dedication = models.CharField(
        max_length=200,
        blank=True,
        help_text="Dedication or memorial information"
    )
    
    # Settings
    is_anonymous = models.BooleanField(
        default=False,
        help_text="Hide donor information from public display"
    )
    
    is_recurring = models.BooleanField(
        default=False,
        help_text="Is this a recurring donation?"
    )
    
    recurring_frequency = models.CharField(
        max_length=20,
        choices=[
            ('monthly', 'Monthly'),
            ('quarterly', 'Quarterly'),
            ('yearly', 'Yearly'),
        ],
        blank=True,
        help_text="Frequency for recurring donations"
    )
    
    # Tax and Receipt Information
    is_tax_deductible = models.BooleanField(
        default=True,
        help_text="Is this donation tax deductible?"
    )
    
    receipt_sent = models.BooleanField(
        default=False,
        help_text="Has receipt been sent to donor?"
    )
    
    receipt_email = models.EmailField(
        blank=True,
        help_text="Email address for receipt"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When payment was completed"
    )
    
    class Meta:
        verbose_name = "Donation"
        verbose_name_plural = "Donations"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['donation_type', '-created_at']),
            models.Index(fields=['shelter', '-created_at']),
            models.Index(fields=['payment_status']),
            models.Index(fields=['donor', '-created_at']),
        ]
    
    def __str__(self):
        donor_name = self.get_donor_display_name()
        target = self.shelter.name if self.shelter else 'Platform'
        return f"${self.amount} from {donor_name} to {target}"
    
    def get_donor_display_name(self):
        """Get donor name for display"""
        if self.is_anonymous:
            return "Anonymous"
        
        if self.donor:
            return self.donor.get_display_name()
        
        if self.anonymous_donor_name:
            return self.anonymous_donor_name
        
        return "Anonymous"
    
    def get_donor_email(self):
        """Get donor email for receipts"""
        if self.receipt_email:
            return self.receipt_email
        
        if self.donor:
            return self.donor.email
        
        if self.anonymous_donor_email:
            return self.anonymous_donor_email
        
        return None
    
    @property
    def is_completed(self):
        """Check if donation is completed"""
        return self.payment_status == 'completed'
    
    @property
    def is_successful(self):
        """Check if donation was successful"""
        return self.payment_status in ['completed', 'processing']


class DonationCampaign(models.Model):
    """
    Special donation campaigns for specific causes
    """
    
    # Campaign Status
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    # Basic Information
    title = models.CharField(
        max_length=200,
        help_text="Campaign title"
    )
    
    description = models.TextField(
        help_text="Detailed campaign description"
    )
    
    short_description = models.CharField(
        max_length=300,
        help_text="Brief campaign summary"
    )
    
    # Campaign Image
    image = models.ImageField(
        upload_to='campaigns/%Y/%m/',
        blank=True,
        null=True,
        help_text="Campaign image"
    )
    
    # Target and Progress
    target_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('1.00'))],
        help_text="Target donation amount"
    )
    
    current_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Current amount raised"
    )
    
    # Beneficiary
    shelter = models.ForeignKey(
        'shelters.Shelter',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='campaigns',
        help_text="Shelter benefiting from campaign (null for platform campaigns)"
    )
    
    # Timeline
    start_date = models.DateTimeField(
        help_text="Campaign start date"
    )
    
    end_date = models.DateTimeField(
        help_text="Campaign end date"
    )
    
    # Status and Settings
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft',
        help_text="Campaign status"
    )
    
    is_featured = models.BooleanField(
        default=False,
        help_text="Feature this campaign on homepage"
    )
    
    allow_anonymous_donations = models.BooleanField(
        default=True,
        help_text="Allow anonymous donations to this campaign"
    )
    
    # Statistics
    total_donors = models.PositiveIntegerField(
        default=0,
        help_text="Total number of donors"
    )
    
    average_donation = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Average donation amount"
    )
    
    # Metadata
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_campaigns',
        help_text="User who created the campaign"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Donation Campaign"
        verbose_name_plural = "Donation Campaigns"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', '-start_date']),
            models.Index(fields=['is_featured', '-created_at']),
            models.Index(fields=['shelter', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.title} (${self.current_amount}/${self.target_amount})"
    
    @property
    def progress_percentage(self):
        """Calculate progress percentage"""
        if self.target_amount > 0:
            return min((self.current_amount / self.target_amount) * 100, 100)
        return 0
    
    @property
    def is_active(self):
        """Check if campaign is currently active"""
        from django.utils import timezone
        return (
            self.status == 'active' and
            self.start_date <= timezone.now() <= self.end_date
        )
    
    @property
    def days_remaining(self):
        """Get days remaining in campaign"""
        from django.utils import timezone
        if self.end_date > timezone.now():
            return (self.end_date.date() - timezone.now().date()).days
        return 0
    
    def update_statistics(self):
        """Update campaign statistics from donations"""
        donations = Donation.objects.filter(
            payment_status='completed',
            donation_type='shelter' if self.shelter else 'platform'
        )
        
        if self.shelter:
            donations = donations.filter(shelter=self.shelter)
        
        stats = donations.aggregate(
            total_amount=models.Sum('amount'),
            total_count=models.Count('id'),
            avg_amount=models.Avg('amount')
        )
        
        self.current_amount = stats['total_amount'] or Decimal('0.00')
        self.total_donors = stats['total_count'] or 0
        self.average_donation = stats['avg_amount'] or Decimal('0.00')
        self.save()


class DonationReceipt(models.Model):
    """
    Tax receipts for donations
    """
    donation = models.OneToOneField(
        Donation,
        on_delete=models.CASCADE,
        related_name='receipt'
    )
    
    receipt_number = models.CharField(
        max_length=50,
        unique=True,
        help_text="Unique receipt number"
    )
    
    issued_date = models.DateTimeField(auto_now_add=True)
    
    tax_year = models.PositiveIntegerField(
        help_text="Tax year for this receipt"
    )
    
    # Receipt file (PDF)
    receipt_file = models.FileField(
        upload_to='receipts/%Y/',
        blank=True,
        null=True,
        help_text="Generated receipt PDF file"
    )
    
    # Email tracking
    email_sent = models.BooleanField(
        default=False,
        help_text="Has receipt been emailed?"
    )
    
    email_sent_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When receipt was emailed"
    )
    
    class Meta:
        verbose_name = "Donation Receipt"
        verbose_name_plural = "Donation Receipts"
        ordering = ['-issued_date']
    
    def __str__(self):
        return f"Receipt {self.receipt_number} for ${self.donation.amount}"
    
    def generate_receipt_number(self):
        """Generate unique receipt number"""
        import uuid
        from datetime import datetime
        year = datetime.now().year
        unique_id = str(uuid.uuid4())[:8].upper()
        return f"ADM-{year}-{unique_id}"
    
    def save(self, *args, **kwargs):
        if not self.receipt_number:
            self.receipt_number = self.generate_receipt_number()
        
        if not self.tax_year:
            self.tax_year = self.donation.created_at.year
        
        super().save(*args, **kwargs)