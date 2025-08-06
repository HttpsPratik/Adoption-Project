
from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from django.db.models import Sum, Count, Avg
from .models import Donation, DonationCampaign, DonationReceipt


@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    """Admin interface for Donation model"""
    
    list_display = [
        'get_donor_name',
        'amount_display',
        'donation_type',
        'shelter',
        'payment_status_display',
        'payment_method',
        'is_anonymous',
        'receipt_sent',
        'created_at'
    ]
    
    list_filter = [
        'donation_type',
        'payment_status',
        'payment_method',
        'is_anonymous',
        'is_recurring',
        'is_tax_deductible',
        'receipt_sent',
        'created_at'
    ]
    
    search_fields = [
        'donor__username',
        'donor__email',
        'donor__first_name',
        'donor__last_name',
        'anonymous_donor_name',
        'anonymous_donor_email',
        'shelter__name',
        'transaction_id',
        'message'
    ]
    
    readonly_fields = [
        'created_at',
        'updated_at',
        'completed_at'
    ]
    
    fieldsets = (
        ('Donor Information', {
            'fields': (
                'donor',
                'anonymous_donor_name',
                'anonymous_donor_email',
                'is_anonymous'
            )
        }),
        ('Donation Details', {
            'fields': (
                'donation_type',
                'shelter',
                'amount',
                'currency',
                'message',
                'dedication'
            )
        }),
        ('Payment Information', {
            'fields': (
                'payment_method',
                'payment_status',
                'transaction_id',
                'payment_processor'
            )
        }),
        ('Recurring Donation', {
            'fields': (
                'is_recurring',
                'recurring_frequency'
            ),
            'classes': ('collapse',)
        }),
        ('Tax & Receipt', {
            'fields': (
                'is_tax_deductible',
                'receipt_sent',
                'receipt_email'
            )
        }),
        ('Timestamps', {
            'fields': (
                'created_at',
                'updated_at',
                'completed_at'
            ),
            'classes': ('collapse',)
        }),
    )
    
    @admin.display(description='Donor')
    def get_donor_name(self, obj):
        name = obj.get_donor_display_name()
        if obj.is_anonymous:
            return format_html('<em>{}</em>', name)
        return name
    
    @admin.display(description='Amount')
    def amount_display(self, obj):
        color = 'green' if obj.is_completed else 'orange'
        return format_html(
            '<span style="color: {}; font-weight: bold;">${}</span>',
            color,
            obj.amount
        )
    
    @admin.display(description='Status')
    def payment_status_display(self, obj):
        colors = {
            'completed': 'green',
            'processing': 'blue',
            'pending': 'orange',
            'failed': 'red',
            'refunded': 'purple',
            'cancelled': 'gray'
        }
        color = colors.get(obj.payment_status, 'black')
        
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.get_payment_status_display()
        )
    
    actions = ['mark_completed', 'mark_receipt_sent', 'generate_receipts']
    
    @admin.action(description='Mark selected donations as completed')
    def mark_completed(self, request, queryset):
        updated = queryset.update(
            payment_status='completed',
            completed_at=timezone.now()
        )
        self.message_user(request, f'{updated} donations marked as completed.')
    
    @admin.action(description='Mark receipts as sent')
    def mark_receipt_sent(self, request, queryset):
        updated = queryset.update(receipt_sent=True)
        self.message_user(request, f'{updated} receipts marked as sent.')
    
    @admin.action(description='Generate receipts for selected donations')
    def generate_receipts(self, request, queryset):
        count = 0
        for donation in queryset.filter(is_tax_deductible=True, payment_status='completed'):
            receipt, created = DonationReceipt.objects.get_or_create(donation=donation)
            if created:
                count += 1
        
        self.message_user(request, f'{count} receipts generated.')


@admin.register(DonationCampaign)
class DonationCampaignAdmin(admin.ModelAdmin):
    """Admin interface for Donation Campaign model"""
    
    list_display = [
        'title',
        'shelter',
        'progress_display',
        'target_amount',
        'total_donors',
        'status',
        'is_featured',
        'days_remaining_display',
        'created_at'
    ]
    
    list_filter = [
        'status',
        'is_featured',
        'start_date',
        'end_date',
        'created_at'
    ]
    
    search_fields = [
        'title',
        'description',
        'shelter__name',
        'created_by__username'
    ]
    
    readonly_fields = [
        'current_amount',
        'total_donors',
        'average_donation',
        'progress_percentage',
        'days_remaining',
        'created_at',
        'updated_at'
    ]
    
    fieldsets = (
        ('Basic Information', {
            'fields': (
                'title',
                'short_description',
                'description',
                'image'
            )
        }),
        ('Campaign Details', {
            'fields': (
                'shelter',
                'target_amount',
                'start_date',
                'end_date'
            )
        }),
        ('Settings', {
            'fields': (
                'status',
                'is_featured',
                'allow_anonymous_donations'
            )
        }),
        ('Statistics', {
            'fields': (
                'current_amount',
                'total_donors',
                'average_donation',
                'progress_percentage',
                'days_remaining'
            ),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': (
                'created_by',
                'created_at',
                'updated_at'
            ),
            'classes': ('collapse',)
        }),
    )
    
    @admin.display(description='Progress')
    def progress_display(self, obj):
        percentage = obj.progress_percentage
        color = 'green' if percentage >= 100 else 'blue' if percentage >= 50 else 'orange'
        
        return format_html(
            '<div style="width: 100px; background: #eee; border-radius: 3px;">'
            '<div style="width: {}%; background: {}; height: 20px; border-radius: 3px; text-align: center; color: white; font-size: 12px; line-height: 20px;">'
            '{}%'
            '</div></div>',
            min(percentage, 100),
            color,
            int(percentage)
        )
    
    @admin.display(description='Days Left')
    def days_remaining_display(self, obj):
        days = obj.days_remaining
        if days > 0:
            return f"{days} days"
        elif days == 0:
            return "Last day"
        else:
            return "Ended"
    
    actions = ['activate_campaigns', 'feature_campaigns', 'update_statistics']
    
    @admin.action(description='Activate selected campaigns')
    def activate_campaigns(self, request, queryset):
        updated = queryset.update(status='active')
        self.message_user(request, f'{updated} campaigns activated.')
    
    @admin.action(description='Feature selected campaigns')
    def feature_campaigns(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f'{updated} campaigns featured.')
    
    @admin.action(description='Update campaign statistics')
    def update_statistics(self, request, queryset):
        for campaign in queryset:
            campaign.update_statistics()
        self.message_user(request, f'{queryset.count()} campaigns updated.')


@admin.register(DonationReceipt)
class DonationReceiptAdmin(admin.ModelAdmin):
    """Admin interface for Donation Receipt model"""
    
    list_display = [
        'receipt_number',
        'donation_amount',
        'donor_name',
        'tax_year',
        'email_sent',
        'issued_date'
    ]
    
    list_filter = [
        'tax_year',
        'email_sent',
        'issued_date'
    ]
    
    search_fields = [
        'receipt_number',
        'donation__donor__username',
        'donation__donor__email',
        'donation__anonymous_donor_name'
    ]
    
    readonly_fields = [
        'receipt_number',
        'issued_date',
        'email_sent_at'
    ]
    
    @admin.display(description='Amount')
    def donation_amount(self, obj):
        return f"${obj.donation.amount}"
    
    @admin.display(description='Donor')
    def donor_name(self, obj):
        return obj.donation.get_donor_display_name()
    
    actions = ['mark_email_sent']
    
    @admin.action(description='Mark emails as sent')
    def mark_email_sent(self, request, queryset):
        updated = queryset.update(
            email_sent=True,
            email_sent_at=timezone.now()
        )
        self.message_user(request, f'{updated} receipts marked as emailed.')


# Customize admin site headers for donations
admin.site.site_header = "🐾 Adopt Me Administration"
admin.site.site_title = "Adopt Me Admin"
admin.site.index_title = "Welcome to Adopt Me Admin Panel"