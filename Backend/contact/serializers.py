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
    
    def validate_email(self, value):
        """Custom email validation"""
        if not value or '@' not in value:
            raise serializers.ValidationError("Please provide a valid email address.")
        return value
    
    def validate_message(self, value):
        """Ensure message is not too short"""
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Message must be at least 10 characters long.")
        return value

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
