# shelters/admin.py
from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from .models import Shelter, ShelterImage, ShelterReview, ShelterVolunteer


class ShelterImageInline(admin.TabularInline):
    """Inline admin for shelter images"""
    model = ShelterImage
    extra = 1
    fields = ['image', 'caption', 'image_type', 'is_primary']


@admin.register(Shelter)
class ShelterAdmin(admin.ModelAdmin):
    """Admin interface for Shelter model"""
    
    list_display = [
        'name',
        'shelter_type',
        'city',
        'state',
        'verification_status_display',
        'current_animal_count',
        'total_adoptions',
        'is_active',
        'created_at'
    ]
    
    list_filter = [
        'shelter_type',
        'verification_status',
        'is_active',
        'accepts_donations',
        'allows_volunteers',
        'state',
        'created_at'
    ]
    
    search_fields = [
        'name',
        'city',
        'state',
        'description',
        'user__username',
        'user__email'
    ]
    
    readonly_fields = [
        'created_at',
        'updated_at',
        'verified_at'
    ]
    
    inlines = [ShelterImageInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': (
                'user',
                'name',
                'shelter_type',
                'registration_number'
            )
        }),
        ('Address', {
            'fields': (
                'address',
                'city',
                'state',
                'postal_code',
                'country'
            )
        }),
        ('Contact Information', {
            'fields': (
                'phone_primary',
                'phone_secondary',
                'email_primary',
                'email_secondary'
            )
        }),
        ('Online Presence', {
            'fields': (
                'website',
                'facebook_url',
                'instagram_url',
                'twitter_url'
            ),
            'classes': ('collapse',)
        }),
        ('Organization Details', {
            'fields': (
                'description',
                'mission_statement',
                'services_offered',
                'operating_hours'
            )
        }),
        ('Capacity & Statistics', {
            'fields': (
                'total_capacity',
                'current_animal_count',
                'total_adoptions'
            )
        }),
        ('Verification', {
            'fields': (
                'verification_status',
                'verified_by',
                'verified_at'
            )
        }),
        ('Settings', {
            'fields': (
                'is_active',
                'accepts_donations',
                'allows_volunteers'
            )
        }),
        ('Timestamps', {
            'fields': (
                'created_at',
                'updated_at'
            ),
            'classes': ('collapse',)
        }),
    )
    
    @admin.display(description='Verification')
    def verification_status_display(self, obj):
        colors = {
            'pending': 'orange',
            'verified': 'green',
            'rejected': 'red',
            'suspended': 'red'
        }
        color = colors.get(obj.verification_status, 'gray')
        
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.get_verification_status_display()
        )
    
    actions = ['verify_shelters', 'suspend_shelters', 'activate_shelters']
    
    @admin.action(description='Verify selected shelters')
    def verify_shelters(self, request, queryset):
        updated = queryset.update(
            verification_status='verified',
            verified_by=request.user,
            verified_at=timezone.now()
        )
        self.message_user(request, f'{updated} shelters verified.')
    
    @admin.action(description='Suspend selected shelters')
    def suspend_shelters(self, request, queryset):
        updated = queryset.update(verification_status='suspended')
        self.message_user(request, f'{updated} shelters suspended.')
    
    @admin.action(description='Activate selected shelters')
    def activate_shelters(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} shelters activated.')


@admin.register(ShelterImage)
class ShelterImageAdmin(admin.ModelAdmin):
    """Admin interface for Shelter Images"""
    
    list_display = [
        'shelter',
        'image_preview',
        'image_type',
        'caption',
        'is_primary',
        'uploaded_at'
    ]
    
    list_filter = [
        'image_type',
        'is_primary',
        'uploaded_at'
    ]
    
    search_fields = [
        'shelter__name',
        'caption'
    ]
    
    @admin.display(description='Preview')
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />',
                obj.image.url
            )
        return "No image"


@admin.register(ShelterReview)
class ShelterReviewAdmin(admin.ModelAdmin):
    """Admin interface for Shelter Reviews"""
    
    list_display = [
        'shelter',
        'reviewer',
        'rating_display',
        'title',
        'experience_type',
        'is_verified_adopter',
        'is_approved',
        'created_at'
    ]
    
    list_filter = [
        'rating',
        'experience_type',
        'is_verified_adopter',
        'is_approved',
        'created_at'
    ]
    
    search_fields = [
        'shelter__name',
        'reviewer__username',
        'title',
        'comment'
    ]
    
    readonly_fields = ['created_at', 'updated_at']
    
    @admin.display(description='Rating')
    def rating_display(self, obj):
        stars = '⭐' * obj.rating + '☆' * (5 - obj.rating)
        return format_html(
            '<span title="{}/5 stars">{}</span>',
            obj.rating,
            stars
        )
    
    actions = ['approve_reviews', 'disapprove_reviews']
    
    @admin.action(description='Approve selected reviews')
    def approve_reviews(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f'{updated} reviews approved.')
    
    @admin.action(description='Disapprove selected reviews')
    def disapprove_reviews(self, request, queryset):
        updated = queryset.update(is_approved=False)
        self.message_user(request, f'{updated} reviews disapproved.')


@admin.register(ShelterVolunteer)
class ShelterVolunteerAdmin(admin.ModelAdmin):
    """Admin interface for Shelter Volunteers"""
    
    list_display = [
        'volunteer_name',
        'shelter',
        'status',
        'background_check_completed',
        'orientation_completed',
        'total_hours',
        'start_date',
        'created_at'
    ]
    
    list_filter = [
        'status',
        'background_check_completed',
        'orientation_completed',
        'start_date',
        'created_at'
    ]
    
    search_fields = [
        'volunteer__username',
        'volunteer__first_name',
        'volunteer__last_name',
        'volunteer__email',
        'shelter__name'
    ]
    
    readonly_fields = ['created_at', 'updated_at']
    
    @admin.display(description='Volunteer')
    def volunteer_name(self, obj):
        return obj.volunteer.get_display_name()
    
    fieldsets = (
        ('Basic Information', {
            'fields': (
                'shelter',
                'volunteer',
                'status'
            )
        }),
        ('Volunteer Details', {
            'fields': (
                'skills',
                'availability',
                'emergency_contact'
            )
        }),
        ('Requirements', {
            'fields': (
                'background_check_completed',
                'orientation_completed'
            )
        }),
        ('Activity', {
            'fields': (
                'start_date',
                'total_hours',
                'notes'
            )
        }),
        ('Timestamps', {
            'fields': (
                'created_at',
                'updated_at'
            ),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['approve_volunteers', 'activate_volunteers']
    
    @admin.action(description='Approve selected volunteers')
    def approve_volunteers(self, request, queryset):
        updated = queryset.update(status='approved')
        self.message_user(request, f'{updated} volunteers approved.')
    
    @admin.action(description='Activate selected volunteers')
    def activate_volunteers(self, request, queryset):
        updated = queryset.update(status='active')
        self.message_user(request, f'{updated} volunteers activated.')