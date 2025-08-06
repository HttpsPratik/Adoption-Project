# accounts/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(DefaultUserAdmin):
    """Custom admin for User model"""
    
    list_display = [
        'username',
        'email',
        'first_name',
        'last_name',
        'location',
        'is_shelter',
        'is_email_verified',
        'is_active',
        'created_at'
    ]
    
    list_filter = [
        'is_shelter',
        'is_email_verified',
        'is_phone_verified',
        'is_staff',
        'is_active',
        'created_at'
    ]
    
    search_fields = [
        'username',
        'email',
        'first_name',
        'last_name',
        'location'
    ]
    
    ordering = ['-created_at']
    list_per_page = 25
    
    # Organize form fields
    fieldsets = DefaultUserAdmin.fieldsets + (
        ('Profile Information', {
            'fields': (
                'location',
                'phone_number',
                'bio',
                'profile_picture'
            )
        }),
        ('Account Type', {
            'fields': ('is_shelter',)
        }),
        ('Verification Status', {
            'fields': (
                'is_email_verified',
                'is_phone_verified'
            )
        }),
        ('Privacy Settings', {
            'fields': (
                'show_email_publicly',
                'show_phone_publicly'
            )
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    add_fieldsets = DefaultUserAdmin.add_fieldsets + (
        ('Additional Information', {
            'fields': (
                'email',
                'first_name',
                'last_name',
                'location',
                'is_shelter'
            )
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']


# Customize admin site
admin.site.site_header = "🐾 Adopt Me Administration"
admin.site.site_title = "Adopt Me Admin"
admin.site.index_title = "Welcome to Adopt Me Admin Panel"