# shelters/serializers.py
# Create this new file for shelter API serializers

from rest_framework import serializers
from django.db.models import Avg, Count
from .models import Shelter, ShelterImage, ShelterReview, ShelterVolunteer
from accounts.serializers import UserPublicProfileSerializer


class ShelterImageSerializer(serializers.ModelSerializer):
    """Serializer for shelter images"""
    
    class Meta:
        model = ShelterImage
        fields = [
            'id',
            'image',
            'caption',
            'image_type',
            'is_primary',
            'uploaded_at'
        ]
        read_only_fields = ['id', 'uploaded_at']


class ShelterListSerializer(serializers.ModelSerializer):
    """
    Serializer for shelter list view (summary information)
    """
    user = UserPublicProfileSerializer(read_only=True)
    primary_image = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    active_pets_count = serializers.SerializerMethodField()
    contact_info = serializers.CharField(source='get_contact_info', read_only=True)
    social_links = serializers.JSONField(source='get_social_media_links', read_only=True)
    occupancy_rate = serializers.FloatField(read_only=True)
    
    class Meta:
        model = Shelter
        fields = [
            'id',
            'user',
            'name',
            'shelter_type',
            'city',
            'state',
            'country',
            'description',
            'services_offered',
            'primary_image',
            'phone_primary',
            'email_primary',
            'website',
            'contact_info',
            'social_links',
            'verification_status',
            'is_verified',
            'total_capacity',
            'current_animal_count',
            'occupancy_rate',
            'total_adoptions',
            'active_pets_count',
            'average_rating',
            'review_count',
            'accepts_donations',
            'allows_volunteers',
            'is_active',
            'created_at'
        ]
    
    def get_primary_image(self, obj):
        """Get the primary image for the shelter"""
        primary_image = obj.images.filter(is_primary=True).first()
        if primary_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primary_image.image.url)
        
        # Return first image if no primary image set
        first_image = obj.images.first()
        if first_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(first_image.image.url)
        
        return None
    
    def get_average_rating(self, obj):
        """Get average rating for the shelter"""
        avg_rating = obj.reviews.filter(is_approved=True).aggregate(
            avg_rating=Avg('rating')
        )['avg_rating']
        return round(avg_rating, 1) if avg_rating else 0
    
    def get_review_count(self, obj):
        """Get total number of approved reviews"""
        return obj.reviews.filter(is_approved=True).count()
    
    def get_active_pets_count(self, obj):
        """Get number of active pets from this shelter"""
        return obj.user.pets.filter(is_active=True, is_adopted=False).count()


class ShelterDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for shelter detail view (complete information)
    """
    user = UserPublicProfileSerializer(read_only=True)
    images = ShelterImageSerializer(many=True, read_only=True)
    full_address = serializers.CharField(source='get_full_address', read_only=True)
    contact_info = serializers.CharField(source='get_contact_info', read_only=True)
    social_links = serializers.JSONField(source='get_social_media_links', read_only=True)
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    active_pets_count = serializers.SerializerMethodField()
    recent_reviews = serializers.SerializerMethodField()
    occupancy_rate = serializers.FloatField(read_only=True)
    
    class Meta:
        model = Shelter
        fields = [
            'id',
            'user',
            'name',
            'shelter_type',
            'registration_number',
            'address',
            'city',
            'state',
            'postal_code',
            'country',
            'full_address',
            'phone_primary',
            'phone_secondary',
            'email_primary',
            'email_secondary',
            'contact_info',
            'website',
            'social_links',
            'description',
            'mission_statement',
            'services_offered',
            'operating_hours',
            'total_capacity',
            'current_animal_count',
            'occupancy_rate',
            'total_adoptions',
            'active_pets_count',
            'verification_status',
            'is_verified',
            'verified_at',
            'accepts_donations',
            'allows_volunteers',
            'is_active',
            'images',
            'average_rating',
            'review_count',
            'recent_reviews',
            'created_at',
            'updated_at'
        ]
    
    def get_average_rating(self, obj):
        """Get average rating for the shelter"""
        avg_rating = obj.reviews.filter(is_approved=True).aggregate(
            avg_rating=Avg('rating')
        )['avg_rating']
        return round(avg_rating, 1) if avg_rating else 0
    
    def get_review_count(self, obj):
        """Get total number of approved reviews"""
        return obj.reviews.filter(is_approved=True).count()
    
    def get_active_pets_count(self, obj):
        """Get number of active pets from this shelter"""
        return obj.user.pets.filter(is_active=True, is_adopted=False).count()
    
    def get_recent_reviews(self, obj):
        """Get recent approved reviews"""
        recent_reviews = obj.reviews.filter(is_approved=True).order_by('-created_at')[:3]
        return ShelterReviewSerializer(recent_reviews, many=True, context=self.context).data


class ShelterCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating shelter profiles
    """
    
    class Meta:
        model = Shelter
        fields = [
            'name',
            'shelter_type',
            'registration_number',
            'address',
            'city',
            'state',
            'postal_code',
            'country',
            'phone_primary',
            'phone_secondary',
            'email_primary',
            'email_secondary',
            'website',
            'facebook_url',
            'instagram_url',
            'twitter_url',
            'description',
            'mission_statement',
            'services_offered',
            'operating_hours',
            'total_capacity',
            'accepts_donations',
            'allows_volunteers'
        ]
    
    def validate(self, data):
        """Custom validation for shelter data"""
        # Ensure shelter user is marked as shelter
        request = self.context.get('request')
        if request and request.user:
            if not request.user.is_shelter:
                raise serializers.ValidationError(
                    'User account must be marked as shelter to create shelter profile.'
                )
        
        return data
    
    def create(self, validated_data):
        """Create shelter profile with current user"""
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ShelterReviewSerializer(serializers.ModelSerializer):
    """Serializer for shelter reviews"""
    reviewer = UserPublicProfileSerializer(read_only=True)
    shelter_name = serializers.CharField(source='shelter.name', read_only=True)
    
    class Meta:
        model = ShelterReview
        fields = [
            'id',
            'shelter',
            'shelter_name',
            'reviewer',
            'rating',
            'title',
            'comment',
            'experience_type',
            'is_verified_adopter',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'reviewer', 'is_verified_adopter', 'created_at', 'updated_at']
    
    def validate_rating(self, value):
        """Validate rating is between 1 and 5"""
        if value < 1 or value > 5:
            raise serializers.ValidationError('Rating must be between 1 and 5.')
        return value
    
    def create(self, validated_data):
        """Create review with current user as reviewer"""
        validated_data['reviewer'] = self.context['request'].user
        return super().create(validated_data)


class ShelterVolunteerSerializer(serializers.ModelSerializer):
    """Serializer for volunteer applications"""
    volunteer = UserPublicProfileSerializer(read_only=True)
    shelter_name = serializers.CharField(source='shelter.name', read_only=True)
    
    class Meta:
        model = ShelterVolunteer
        fields = [
            'id',
            'shelter',
            'shelter_name',
            'volunteer',
            'status',
            'skills',
            'availability',
            'emergency_contact',
            'background_check_completed',
            'orientation_completed',
            'start_date',
            'total_hours',
            'notes',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'id',
            'volunteer',
            'status',
            'background_check_completed',
            'orientation_completed',
            'start_date',
            'total_hours',
            'notes',
            'created_at',
            'updated_at'
        ]
    
    def create(self, validated_data):
        """Create volunteer application with current user"""
        validated_data['volunteer'] = self.context['request'].user
        return super().create(validated_data)


class ShelterImageUploadSerializer(serializers.ModelSerializer):
    """Serializer for uploading shelter images"""
    
    class Meta:
        model = ShelterImage
        fields = [
            'image',
            'caption',
            'image_type',
            'is_primary'
        ]
    
    def create(self, validated_data):
        """Create image with shelter from URL parameter"""
        shelter_id = self.context['view'].kwargs.get('pk')
        validated_data['shelter_id'] = shelter_id
        return super().create(validated_data)


class ShelterStatsSerializer(serializers.Serializer):
    """Serializer for shelter statistics"""
    total_shelters = serializers.IntegerField()
    verified_shelters = serializers.IntegerField()  
    total_capacity = serializers.IntegerField()
    total_animals = serializers.IntegerField()
    total_adoptions = serializers.IntegerField()
    average_rating = serializers.FloatField()
    top_rated_shelters = ShelterListSerializer(many=True)


class ShelterSearchSerializer(serializers.Serializer):
    """Serializer for shelter search parameters"""
    shelter_type = serializers.ChoiceField(
        choices=Shelter.SHELTER_TYPE_CHOICES,
        required=False
    )
    city = serializers.CharField(max_length=100, required=False)
    state = serializers.CharField(max_length=100, required=False)
    country = serializers.CharField(max_length=100, required=False)
    verified_only = serializers.BooleanField(required=False)
    accepts_donations = serializers.BooleanField(required=False)
    allows_volunteers = serializers.BooleanField(required=False)
    min_rating = serializers.FloatField(min_value=1, max_value=5, required=False)
    search = serializers.CharField(max_length=100, required=False)