# accounts/serializers.py
# Create this new file for API serializers

from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration
    """
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password',
            'password_confirm',
            'first_name',
            'last_name',
            'location',
            'phone_number',
            'bio',
            'is_shelter',
            'show_email_publicly',
            'show_phone_publicly'
        ]
        extra_kwargs = {
            'email': {'required': True},
            'username': {'required': True}
        }
    
    def validate_email(self, value):
        """Check if email is already registered"""
        if User.objects.filter(email=value.lower()).exists():
            raise serializers.ValidationError(
                'A user with this email already exists.'
            )
        return value.lower()
    
    def validate_username(self, value):
        """Check if username is already taken"""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                'A user with this username already exists.'
            )
        return value
    
    def validate(self, data):
        """Check if passwords match"""
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': 'Passwords do not match.'
            })
        return data
    
    def create(self, validated_data):
        """Create new user with hashed password"""
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        
        return user


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login
    """
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'})
    
    def validate(self, data):
        """Validate email and password"""
        email = data.get('email')
        password = data.get('password')
        
        if email and password:
            user = authenticate(
                request=self.context.get('request'),
                username=email,
                password=password
            )
            
            if not user:
                raise serializers.ValidationError(
                    'Invalid email or password.',
                    code='authorization'
                )
            
            if not user.is_active:
                raise serializers.ValidationError(
                    'User account is disabled.',
                    code='authorization'
                )
            
            data['user'] = user
            return data
        else:
            raise serializers.ValidationError(
                'Must include email and password.',
                code='authorization'
            )


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile (full details)
    """
    display_name = serializers.CharField(source='get_display_name', read_only=True)
    contact_info = serializers.CharField(source='get_contact_info', read_only=True)
    is_verified = serializers.BooleanField(source='is_verified', read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'display_name',
            'location',
            'phone_number',
            'bio',
            'profile_picture',
            'is_shelter',
            'is_email_verified',
            'is_phone_verified',
            'is_verified',
            'show_email_publicly',
            'show_phone_publicly',
            'contact_info',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'id',
            'email',  # Email changes through separate endpoint
            'is_email_verified',
            'is_phone_verified',
            'created_at',
            'updated_at'
        ]


class UserPublicProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for public user profile (limited info)
    """
    display_name = serializers.CharField(source='get_display_name', read_only=True)
    contact_info = serializers.CharField(source='get_contact_info', read_only=True)
    is_verified = serializers.BooleanField(source='is_verified', read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'display_name',
            'location',
            'bio',
            'profile_picture',
            'is_shelter',
            'is_verified',
            'contact_info',
            'created_at'
        ]


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for changing password
    """
    old_password = serializers.CharField(style={'input_type': 'password'})
    new_password = serializers.CharField(
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    new_password_confirm = serializers.CharField(style={'input_type': 'password'})
    
    def validate_old_password(self, value):
        """Check if old password is correct"""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Old password is incorrect.')
        return value
    
    def validate(self, data):
        """Check if new passwords match"""
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError({
                'new_password_confirm': 'New passwords do not match.'
            })
        return data
    
    def save(self):
        """Update user password"""
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user