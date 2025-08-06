from django.contrib import admin
from .models import ContactMessage, ContactInfo

# Simple admin registration without decorators
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'status', 'created_at']
    list_filter = ['status', 'subject', 'created_at']
    search_fields = ['name', 'email', 'message']
    readonly_fields = ['created_at', 'updated_at']

class ContactInfoAdmin(admin.ModelAdmin):
    list_display = ['organization_name', 'phone_primary', 'email_primary', 'is_active']
    list_filter = ['is_active', 'province']

# Register models
admin.site.register(ContactMessage, ContactMessageAdmin)
admin.site.register(ContactInfo, ContactInfoAdmin)

# contact/apps.py - Replace the entire file content
from django.apps import AppConfig

class ContactConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'contact'
