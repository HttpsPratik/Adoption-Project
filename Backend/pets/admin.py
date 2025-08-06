# pets/admin.py - Fix the import error

from django.contrib import admin
from .models import Pet  # Only import models that actually exist

# Simple admin registration for Pet model
@admin.register(Pet)
class PetAdmin(admin.ModelAdmin):
    list_display = ['name', 'pet_type', 'age', 'gender', 'size', 'status', 'province', 'city', 'created_at']
    list_filter = ['pet_type', 'status', 'gender', 'size', 'province', 'is_vaccinated', 'is_neutered']
    search_fields = ['name', 'breed', 'city', 'district', 'description']
    list_editable = ['status']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'pet_type', 'breed', 'age', 'gender', 'size', 'color', 'description')
        }),
        ('Health Information', {
            'fields': ('is_vaccinated', 'is_neutered', 'health_status')
        }),
        ('Location', {
            'fields': ('province', 'district', 'city', 'detailed_address')
        }),
        ('Status & Contact', {
            'fields': ('status', 'is_active', 'contact_phone', 'contact_email')
        }),
        ('Missing Pet Info', {
            'fields': ('last_seen_location', 'last_seen_date', 'reward_offered'),
            'classes': ('collapse',)
        }),
        ('Media', {
            'fields': ('image',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

# If you have PetImage model, uncomment this:
# @admin.register(PetImage)
# class PetImageAdmin(admin.ModelAdmin):
#     list_display = ['pet', 'caption', 'uploaded_at']
#     list_filter = ['uploaded_at']