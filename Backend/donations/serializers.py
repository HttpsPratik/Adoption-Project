
from rest_framework import serializers
from django.db.models import Sum, Count, Avg
from decimal import Decimal
from .models import Donation, DonationCampaign, DonationReceipt
from accounts.serializers import UserPublicProfileSerializer
from shelters.serializers import ShelterListSerializer


class DonationSerializer(serializers.ModelSerializer):
    """
    Serializer for donations (list and detail view)
    """
    donor = UserPublicProfileSerializer(read_only=True)
    shelter = ShelterListSerializer(read_only=True)
    donor_display_name = serializers.CharField(source='get_donor_display_name', read_only=True)
    donor_email = serializers.CharField(source='get_donor_email', read_only=True)
    
    class Meta:
        model = Donation
        fields = [
            'id',
            'donor',
            'donor_display_name',
            'donor_email',
            'donation_type',
            'shelter',
            'amount',
            'currency',
            'payment_method',
            'payment_status',
            'transaction_id',
            'message',
            'dedication',
            'is_anonymous',
            'is_recurring',
            'recurring_frequency',
            'is_tax_deductible',
            'receipt_sent',
            'is_completed',
            'is_successful',
            'created_at',
            'updated_at',
            'completed_at'
        ]


class DonationCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating donations
    """
    
    class Meta:
        model = Donation
        fields = [
            'donation_type',
            'shelter',
            'amount',
            'currency',
            'payment_method',
            'anonymous_donor_name',
            'anonymous_donor_email',
            'message',
            'dedication',
            'is_anonymous',
            'is_recurring',
            'recurring_frequency',
            'receipt_email'
        ]
    
    def validate_amount(self, value):
        """Validate donation amount"""
        if value <= 0:
            raise serializers.ValidationError('Donation amount must be greater than 0.')
        
        if value > Decimal('100000.00'):
            raise serializers.ValidationError('Donation amount cannot exceed $100,000.')
        
        return value
    
    def validate(self, data):
        """Cross-field validation"""
        donation_type = data.get('donation_type')
        shelter = data.get('shelter')
        
        # Validate shelter requirement for shelter donations
        if donation_type == 'shelter' and not shelter:
            raise serializers.ValidationError({
                'shelter': 'Shelter is required for shelter donations.'
            })
        
        # Validate anonymous donor information
        is_anonymous = data.get('is_anonymous', False)
        if is_anonymous:
            if not data.get('anonymous_donor_name'):
                raise serializers.ValidationError({
                    'anonymous_donor_name': 'Name is required for anonymous donations.'
                })
            if not data.get('anonymous_donor_email'):
                raise serializers.ValidationError({
                    'anonymous_donor_email': 'Email is required for anonymous donations.'
                })
        
        # Validate recurring donation frequency
        is_recurring = data.get('is_recurring', False)
        if is_recurring and not data.get('recurring_frequency'):
            raise serializers.ValidationError({
                'recurring_frequency': 'Frequency is required for recurring donations.'
            })
        
        return data
    
    def create(self, validated_data):
        """Create donation with current user as donor (if not anonymous)"""
        request = self.context.get('request')
        
        if not validated_data.get('is_anonymous') and request and request.user.is_authenticated:
            validated_data['donor'] = request.user
        
        # Set default values
        validated_data['payment_status'] = 'pending'
        validated_data['is_tax_deductible'] = True
        
        return super().create(validated_data)


class DonationCampaignSerializer(serializers.ModelSerializer):
    """
    Serializer for donation campaigns (list and detail view)
    """
    shelter = ShelterListSerializer(read_only=True)
    created_by = UserPublicProfileSerializer(read_only=True)
    progress_percentage = serializers.FloatField(read_only=True)
    days_remaining = serializers.IntegerField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    recent_donations = serializers.SerializerMethodField()
    top_donors = serializers.SerializerMethodField()
    
    class Meta:
        model = DonationCampaign
        fields = [
            'id',
            'title',
            'description',
            'short_description',
            'image',
            'shelter',
            'target_amount',
            'current_amount',
            'progress_percentage',
            'total_donors',
            'average_donation',
            'start_date',
            'end_date',
            'days_remaining',
            'status',
            'is_featured',
            'is_active',
            'allow_anonymous_donations',
            'created_by',
            'recent_donations',
            'top_donors',
            'created_at',
            'updated_at'
        ]
    
    def get_recent_donations(self, obj):
        """Get recent donations to this campaign"""
        if obj.shelter:
            recent_donations = Donation.objects.filter(
                shelter=obj.shelter,
                payment_status='completed',
                donation_type='shelter'
            ).order_by('-created_at')[:5]
        else:
            recent_donations = Donation.objects.filter(
                donation_type='platform',
                payment_status='completed'
            ).order_by('-created_at')[:5]
        
        return DonationSerializer(recent_donations, many=True, context=self.context).data
    
    def get_top_donors(self, obj):
        """Get top donors for this campaign (non-anonymous only)"""
        if obj.shelter:
            top_donors = Donation.objects.filter(
                shelter=obj.shelter,
                payment_status='completed',
                donation_type='shelter',
                is_anonymous=False,
                donor__isnull=False
            ).values('donor').annotate(
                total_amount=Sum('amount')
            ).order_by('-total_amount')[:5]
        else:
            top_donors = Donation.objects.filter(
                donation_type='platform',
                payment_status='completed',
                is_anonymous=False,
                donor__isnull=False
            ).values('donor').annotate(
                total_amount=Sum('amount')
            ).order_by('-total_amount')[:5]
        
        # Convert to user objects and serialize
        from accounts.models import User
        donor_data = []
        for donor_info in top_donors:
            try:
                user = User.objects.get(id=donor_info['donor'])
                donor_data.append({
                    'user': UserPublicProfileSerializer(user, context=self.context).data,
                    'total_amount': donor_info['total_amount']
                })
            except User.DoesNotExist:
                pass
        
        return donor_data


class DonationCampaignCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating donation campaigns
    """
    
    class Meta:
        model = DonationCampaign
        fields = [
            'title',
            'description',
            'short_description',
            'image',
            'shelter',
            'target_amount',
            'start_date',
            'end_date',
            'allow_anonymous_donations'
        ]
    
    def validate_target_amount(self, value):
        """Validate target amount"""
        if value <= 0:
            raise serializers.ValidationError('Target amount must be greater than 0.')
        
        if value > Decimal('1000000.00'):
            raise serializers.ValidationError('Target amount cannot exceed $1,000,000.')
        
        return value
    
    def validate(self, data):
        """Cross-field validation"""
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        
        if start_date and end_date and start_date >= end_date:
            raise serializers.ValidationError({
                'end_date': 'End date must be after start date.'
            })
        
        return data
    
    def create(self, validated_data):
        """Create campaign with current user as creator"""
        validated_data['created_by'] = self.context['request'].user
        validated_data['status'] = 'draft'  # Start as draft
        return super().create(validated_data)


class DonationReceiptSerializer(serializers.ModelSerializer):
    """
    Serializer for donation receipts
    """
    donation = DonationSerializer(read_only=True)
    
    class Meta:
        model = DonationReceipt
        fields = [
            'id',
            'donation',
            'receipt_number',
            'tax_year',
            'receipt_file',
            'email_sent',
            'email_sent_at',
            'issued_date'
        ]


class DonationStatsSerializer(serializers.Serializer):
    """
    Serializer for donation statistics
    """
    total_donations = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_donations_count = serializers.IntegerField()
    average_donation = serializers.DecimalField(max_digits=8, decimal_places=2)
    total_donors = serializers.IntegerField()
    
    # By type
    shelter_donations = serializers.DecimalField(max_digits=12, decimal_places=2)
    platform_donations = serializers.DecimalField(max_digits=12, decimal_places=2)
    emergency_donations = serializers.DecimalField(max_digits=12, decimal_places=2)
    
    # Recent stats
    recent_donations = serializers.DecimalField(max_digits=12, decimal_places=2)
    recent_donations_count = serializers.IntegerField()
    
    # Campaign stats
    total_campaigns = serializers.IntegerField()
    active_campaigns = serializers.IntegerField()
    featured_campaigns = serializers.IntegerField()
    
    # Top campaigns and donors
    top_campaigns = DonationCampaignSerializer(many=True)
    recent_large_donations = DonationSerializer(many=True)


class PaymentIntentSerializer(serializers.Serializer):
    """
    Serializer for payment intent creation (for future payment processing)
    """
    donation_id = serializers.IntegerField()
    payment_method = serializers.CharField(max_length=20)
    return_url = serializers.URLField(required=False)
    
    def validate_donation_id(self, value):
        """Validate donation exists and is in pending status"""
        try:
            donation = Donation.objects.get(id=value, payment_status='pending')
            return value
        except Donation.DoesNotExist:
            raise serializers.ValidationError('Invalid donation ID or donation not in pending status.')


class DonationSearchSerializer(serializers.Serializer):
    """
    Serializer for donation search parameters
    """
    donation_type = serializers.ChoiceField(
        choices=Donation.DONATION_TYPE_CHOICES,
        required=False
    )
    payment_status = serializers.ChoiceField(
        choices=Donation.PAYMENT_STATUS_CHOICES,
        required=False
    )
    payment_method = serializers.ChoiceField(
        choices=Donation.PAYMENT_METHOD_CHOICES,
        required=False
    )
    shelter_id = serializers.IntegerField(required=False)
    min_amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    max_amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    date_from = serializers.DateTimeField(required=False)
    date_to = serializers.DateTimeField(required=False)
    is_anonymous = serializers.BooleanField(required=False)
    is_recurring = serializers.BooleanField(required=False)
    has_message = serializers.BooleanField(required=False)