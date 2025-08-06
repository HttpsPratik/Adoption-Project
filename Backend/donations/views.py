# donations/views.py
# Replace the existing content with this complete API implementation

from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q, Sum, Count, Avg
from django.utils import timezone
from decimal import Decimal
from .models import Donation, DonationCampaign, DonationReceipt
from .serializers import (
    DonationSerializer,
    DonationCreateSerializer,
    DonationCampaignSerializer,
    DonationCampaignCreateUpdateSerializer,
    DonationReceiptSerializer,
    DonationStatsSerializer,
    PaymentIntentSerializer
)


# ===== DONATION VIEWS =====

class DonationListView(generics.ListAPIView):
    """
    List all donations (with filtering)
    
    GET /api/donations/
    Query params: ?donation_type=shelter&payment_status=completed&shelter_id=1
    """
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = Donation.objects.select_related('donor', 'shelter').order_by('-created_at')
        
        # Only show public donations (completed and not anonymous or user's own)
        if not self.request.user.is_staff:
            queryset = queryset.filter(
                Q(payment_status='completed') &
                (Q(is_anonymous=False) | Q(donor=self.request.user if self.request.user.is_authenticated else None))
            )
        
        # Filter by donation type
        donation_type = self.request.query_params.get('donation_type')
        if donation_type:
            queryset = queryset.filter(donation_type=donation_type)
        
        # Filter by payment status
        payment_status = self.request.query_params.get('payment_status')
        if payment_status:
            queryset = queryset.filter(payment_status=payment_status)
        
        # Filter by shelter
        shelter_id = self.request.query_params.get('shelter_id')
        if shelter_id:
            queryset = queryset.filter(shelter_id=shelter_id)
        
        # Filter by amount range
        min_amount = self.request.query_params.get('min_amount')
        if min_amount:
            try:
                queryset = queryset.filter(amount__gte=Decimal(min_amount))
            except:
                pass
        
        max_amount = self.request.query_params.get('max_amount')
        if max_amount:
            try:
                queryset = queryset.filter(amount__lte=Decimal(max_amount))
            except:
                pass
        
        # Filter by date range
        date_from = self.request.query_params.get('date_from')
        if date_from:
            queryset = queryset.filter(created_at__gte=date_from)
        
        date_to = self.request.query_params.get('date_to')
        if date_to:
            queryset = queryset.filter(created_at__lte=date_to)
        
        return queryset
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'success': True,
            'message': 'Donations retrieved successfully',
            'data': {
                'count': len(serializer.data),
                'donations': serializer.data
            }
        })


class DonationDetailView(generics.RetrieveAPIView):
    """
    Get detailed information about a specific donation
    
    GET /api/donations/{donation_id}/
    """
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Only allow viewing of public donations or user's own donations
        if not self.request.user.is_staff:
            queryset = queryset.filter(
                Q(payment_status='completed') &
                (Q(is_anonymous=False) | Q(donor=self.request.user if self.request.user.is_authenticated else None))
            )
        
        return queryset
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        return Response({
            'success': True,
            'message': 'Donation details retrieved successfully',
            'data': {
                'donation': serializer.data
            }
        })


class DonationCreateView(generics.CreateAPIView):
    """
    Create a new donation
    
    POST /api/donations/create/
    {
        "donation_type": "shelter",
        "shelter": 1,
        "amount": "50.00",
        "payment_method": "credit_card",
        "message": "Keep up the great work!",
        "is_anonymous": false
    }
    """
    serializer_class = DonationCreateSerializer
    permission_classes = [permissions.AllowAny]  # Allow anonymous donations
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            donation = serializer.save()
            
            # Return detailed donation information
            detail_serializer = DonationSerializer(donation, context={'request': request})
            
            return Response({
                'success': True,
                'message': 'Donation created successfully! Please complete payment.',
                'data': {
                    'donation': detail_serializer.data,
                    'next_step': 'process_payment',
                    'payment_url': f'/api/donations/{donation.id}/payment/'
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'message': 'Donation creation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class UserDonationsView(generics.ListAPIView):
    """
    Get current user's donations
    
    GET /api/donations/my-donations/
    """
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Donation.objects.filter(donor=self.request.user).order_by('-created_at')
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'success': True,
            'message': 'Your donations retrieved successfully',
            'data': {
                'count': len(serializer.data),
                'donations': serializer.data
            }
        })


# ===== DONATION CAMPAIGNS =====

class DonationCampaignListView(generics.ListAPIView):
    """
    List all active donation campaigns
    
    GET /api/donations/campaigns/
    Query params: ?featured=true&shelter_id=1&status=active
    """
    serializer_class = DonationCampaignSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = DonationCampaign.objects.select_related('shelter', 'created_by').order_by('-created_at')
        
        # Filter by status
        status_filter = self.request.query_params.get('status', 'active')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by featured campaigns
        featured = self.request.query_params.get('featured')
        if featured and featured.lower() == 'true':
            queryset = queryset.filter(is_featured=True)
        
        # Filter by shelter
        shelter_id = self.request.query_params.get('shelter_id')
        if shelter_id:
            queryset = queryset.filter(shelter_id=shelter_id)
        
        # Filter by active campaigns only (within date range)
        active_only = self.request.query_params.get('active_only')
        if active_only and active_only.lower() == 'true':
            now = timezone.now()
            queryset = queryset.filter(
                start_date__lte=now,
                end_date__gte=now,
                status='active'
            )
        
        return queryset
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'success': True,
            'message': 'Donation campaigns retrieved successfully',
            'data': {
                'count': len(serializer.data),
                'campaigns': serializer.data
            }
        })


class DonationCampaignDetailView(generics.RetrieveAPIView):
    """
    Get detailed information about a specific campaign
    
    GET /api/donations/campaigns/{campaign_id}/
    """
    queryset = DonationCampaign.objects.all()
    serializer_class = DonationCampaignSerializer
    permission_classes = [permissions.AllowAny]
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        return Response({
            'success': True,
            'message': 'Campaign details retrieved successfully',
            'data': {
                'campaign': serializer.data
            }
        })


class DonationCampaignCreateView(generics.CreateAPIView):
    """
    Create a new donation campaign (for shelters)
    
    POST /api/donations/campaigns/create/
    {
        "title": "Emergency Medical Fund",
        "description": "Help us save injured animals",
        "target_amount": "5000.00",
        "start_date": "2024-01-01T00:00:00Z",
        "end_date": "2024-03-01T00:00:00Z",
        "shelter": 1
    }
    """
    serializer_class = DonationCampaignCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            campaign = serializer.save()
            
            # Return detailed campaign information
            detail_serializer = DonationCampaignSerializer(campaign, context={'request': request})
            
            return Response({
                'success': True,
                'message': 'Campaign created successfully!',
                'data': {
                    'campaign': detail_serializer.data
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'message': 'Campaign creation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class DonationCampaignUpdateView(generics.UpdateAPIView):
    """
    Update a donation campaign (only by creator)
    
    PUT/PATCH /api/donations/campaigns/{campaign_id}/update/
    """
    serializer_class = DonationCampaignCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return DonationCampaign.objects.filter(created_by=self.request.user)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            campaign = serializer.save()
            
            # Return detailed campaign information
            detail_serializer = DonationCampaignSerializer(campaign, context={'request': request})
            
            return Response({
                'success': True,
                'message': 'Campaign updated successfully!',
                'data': {
                    'campaign': detail_serializer.data
                }
            })
        
        return Response({
            'success': False,
            'message': 'Campaign update failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


# ===== PAYMENT PROCESSING =====

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def process_payment(request, pk):
    """
    Process payment for a donation (placeholder for payment integration)
    
    POST /api/donations/{donation_id}/payment/
    {
        "payment_method": "credit_card",
        "payment_token": "tok_visa_debit",
        "return_url": "https://frontend.com/donation-success"
    }
    """
    donation = get_object_or_404(Donation, pk=pk, payment_status='pending')
    
    payment_method = request.data.get('payment_method')
    payment_token = request.data.get('payment_token')
    
    if not payment_token:
        return Response({
            'success': False,
            'message': 'Payment token is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # TODO: Integrate with actual payment processor (Stripe, PayPal, etc.)
        # For now, we'll simulate successful payment
        
        # Simulate payment processing
        import uuid
        transaction_id = str(uuid.uuid4())
        
        # Update donation status
        donation.payment_status = 'completed'
        donation.completed_at = timezone.now()
        donation.transaction_id = transaction_id
        donation.payment_processor = 'stripe'  # or actual processor
        donation.save()
        
        # Generate receipt if tax deductible
        if donation.is_tax_deductible:
            receipt, created = DonationReceipt.objects.get_or_create(donation=donation)
        
        # Update campaign statistics if applicable
        if donation.shelter and donation.donation_type == 'shelter':
            campaigns = DonationCampaign.objects.filter(
                shelter=donation.shelter,
                status='active'
            )
            for campaign in campaigns:
                campaign.update_statistics()
        
        return Response({
            'success': True,
            'message': 'Payment processed successfully!',
            'data': {
                'donation_id': donation.id,
                'transaction_id': transaction_id,
                'amount': donation.amount,
                'receipt_available': donation.is_tax_deductible
            }
        })
        
    except Exception as e:
        # Update donation status to failed
        donation.payment_status = 'failed'
        donation.save()
        
        return Response({
            'success': False,
            'message': 'Payment processing failed',
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


# ===== DONATION RECEIPTS =====

class UserReceiptsView(generics.ListAPIView):
    """
    Get current user's donation receipts
    
    GET /api/donations/my-receipts/
    """
    serializer_class = DonationReceiptSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return DonationReceipt.objects.filter(
            donation__donor=self.request.user
        ).order_by('-issued_date')
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'success': True,
            'message': 'Your receipts retrieved successfully',
            'data': {
                'count': len(serializer.data),
                'receipts': serializer.data
            }
        })


class ReceiptDetailView(generics.RetrieveAPIView):
    """
    Get specific donation receipt
    
    GET /api/donations/receipts/{receipt_id}/
    """
    queryset = DonationReceipt.objects.all()
    serializer_class = DonationReceiptSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Only allow users to access their own receipts
        return super().get_queryset().filter(donation__donor=self.request.user)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        return Response({
            'success': True,
            'message': 'Receipt retrieved successfully',
            'data': {
                'receipt': serializer.data
            }
        })


# ===== DONATION STATISTICS =====

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def donation_statistics(request):
    """
    Get overall donation statistics
    
    GET /api/donations/statistics/
    """
    # Calculate overall statistics
    completed_donations = Donation.objects.filter(payment_status='completed')
    
    total_stats = completed_donations.aggregate(
        total_amount=Sum('amount'),
        total_count=Count('id'),
        avg_amount=Avg('amount'),
        unique_donors=Count('donor', distinct=True)
    )
    
    # Statistics by type
    type_stats = {}
    for donation_type, _ in Donation.DONATION_TYPE_CHOICES:
        type_amount = completed_donations.filter(donation_type=donation_type).aggregate(
            amount=Sum('amount')
        )['amount'] or Decimal('0.00')
        type_stats[f'{donation_type}_donations'] = type_amount
    
    # Recent donations (last 30 days)
    recent_cutoff = timezone.now() - timezone.timedelta(days=30)
    recent_stats = completed_donations.filter(created_at__gte=recent_cutoff).aggregate(
        recent_amount=Sum('amount'),
        recent_count=Count('id')
    )
    
    # Campaign statistics
    campaign_stats = DonationCampaign.objects.aggregate(
        total_campaigns=Count('id'),
        active_campaigns=Count('id', filter=Q(status='active')),
        featured_campaigns=Count('id', filter=Q(is_featured=True))
    )
    
    # Top campaigns by amount raised
    top_campaigns = DonationCampaign.objects.filter(
        status__in=['active', 'completed']
    ).order_by('-current_amount')[:5]
    
    # Recent large donations (over $100)
    large_donations = completed_donations.filter(
        amount__gte=Decimal('100.00'),
        is_anonymous=False
    ).order_by('-created_at')[:10]
    
    # Compile statistics
    stats_data = {
        'total_donations': total_stats['total_amount'] or Decimal('0.00'),
        'total_donations_count': total_stats['total_count'] or 0,
        'average_donation': total_stats['avg_amount'] or Decimal('0.00'),
        'total_donors': total_stats['unique_donors'] or 0,
        
        # By type
        'shelter_donations': type_stats.get('shelter_donations', Decimal('0.00')),
        'platform_donations': type_stats.get('platform_donations', Decimal('0.00')),
        'emergency_donations': type_stats.get('emergency_donations', Decimal('0.00')),
        
        # Recent stats
        'recent_donations': recent_stats['recent_amount'] or Decimal('0.00'),
        'recent_donations_count': recent_stats['recent_count'] or 0,
        
        # Campaign stats
        'total_campaigns': campaign_stats['total_campaigns'] or 0,
        'active_campaigns': campaign_stats['active_campaigns'] or 0,
        'featured_campaigns': campaign_stats['featured_campaigns'] or 0,
        
        # Top data
        'top_campaigns': DonationCampaignSerializer(
            top_campaigns, 
            many=True, 
            context={'request': request}
        ).data,
        'recent_large_donations': DonationSerializer(
            large_donations, 
            many=True, 
            context={'request': request}
        ).data
    }
    
    return Response({
        'success': True,
        'message': 'Donation statistics retrieved successfully',
        'data': stats_data
    })


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def shelter_donation_stats(request, pk):
    """
    Get donation statistics for a specific shelter
    
    GET /api/donations/shelters/{shelter_id}/statistics/
    """
    from shelters.models import Shelter
    shelter = get_object_or_404(Shelter, pk=pk)
    
    # Calculate shelter-specific statistics
    shelter_donations = Donation.objects.filter(
        shelter=shelter,
        payment_status='completed'
    )
    
    stats = shelter_donations.aggregate(
        total_amount=Sum('amount'),
        total_count=Count('id'),
        avg_amount=Avg('amount'),
        unique_donors=Count('donor', distinct=True)
    )
    
    # Recent donations (last 30 days)
    recent_cutoff = timezone.now() - timezone.timedelta(days=30)
    recent_stats = shelter_donations.filter(created_at__gte=recent_cutoff).aggregate(
        recent_amount=Sum('amount'),
        recent_count=Count('id')
    )
    
    # Active campaigns for this shelter
    active_campaigns = DonationCampaign.objects.filter(
        shelter=shelter,
        status='active'
    )
    
    # Recent donors (non-anonymous)
    recent_donors = shelter_donations.filter(
        is_anonymous=False,
        donor__isnull=False
    ).order_by('-created_at')[:10]
    
    stats_data = {
        'shelter_name': shelter.name,
        'total_donations': stats['total_amount'] or Decimal('0.00'),
        'total_donations_count': stats['total_count'] or 0,
        'average_donation': stats['avg_amount'] or Decimal('0.00'),
        'total_donors': stats['unique_donors'] or 0,
        'recent_donations': recent_stats['recent_amount'] or Decimal('0.00'),
        'recent_donations_count': recent_stats['recent_count'] or 0,
        'active_campaigns': DonationCampaignSerializer(
            active_campaigns, 
            many=True, 
            context={'request': request}
        ).data,
        'recent_donors': DonationSerializer(
            recent_donors, 
            many=True, 
            context={'request': request}
        ).data
    }
    
    return Response({
        'success': True,
        'message': f'Donation statistics for {shelter.name} retrieved successfully',
        'data': stats_data
    })