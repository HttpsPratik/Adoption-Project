from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Pet, PetImage, AdoptionRequest

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class PetImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetImage
        fields = ['id', 'image', 'caption', 'uploaded_at']

class PetSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    additional_images = PetImageSerializer(many=True, read_only=True)
    location_display = serializers.ReadOnlyField()
    
    class Meta:
        model = Pet
        fields = [
            'id', 'name', 'pet_type', 'breed', 'age', 'gender', 'size', 'color',
            'description', 'is_vaccinated', 'is_neutered', 'health_status',
            'province', 'district', 'city', 'detailed_address', 'location_display',
            'status', 'is_active', 'last_seen_location', 'last_seen_date',
            'reward_offered', 'contact_phone', 'contact_email',
            'owner', 'shelter', 'image', 'additional_images',
            'created_at', 'updated_at', 'is_missing', 'is_available_for_adoption'
        ]
        read_only_fields = ['created_at', 'updated_at', 'owner']

class MissingPetSerializer(serializers.ModelSerializer):
    """Serializer specifically for missing pets"""
    owner = UserSerializer(read_only=True)
    additional_images = PetImageSerializer(many=True, read_only=True)
    location_display = serializers.ReadOnlyField()
    
    class Meta:
        model = Pet
        fields = [
            'id', 'name', 'pet_type', 'breed', 'age', 'gender', 'size', 'color',
            'description', 'province', 'district', 'city', 'detailed_address',
            'location_display', 'last_seen_location', 'last_seen_date',
            'reward_offered', 'contact_phone', 'contact_email',
            'owner', 'image', 'additional_images', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'owner']

class AdoptionRequestSerializer(serializers.ModelSerializer):
    pet = PetSerializer(read_only=True)
    adopter = UserSerializer(read_only=True)
    
    class Meta:
        model = AdoptionRequest
        fields = [
            'id', 'pet', 'adopter', 'message', 'status',
            'phone_number', 'address', 'has_experience', 'living_situation',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'adopter']

# contact/serializers.py
from rest_framework import serializers
from .models import ContactMessage, ContactInfo

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = [
            'id', 'name', 'email', 'phone', 'subject', 'message',
            'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']

class ContactInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInfo
        fields = [
            'id', 'organization_name', 'tagline', 'phone_primary', 'phone_secondary',
            'email_primary', 'email_secondary', 'address_line_1', 'address_line_2',
            'city', 'district', 'province', 'postal_code', 'facebook_url',
            'instagram_url', 'twitter_url', 'youtube_url', 'office_hours',
            'emergency_phone'
        ]