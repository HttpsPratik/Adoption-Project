# donations/urls.py
# Create this new file for donations URL patterns

from django.urls import path
from . import views

app_name = 'donations'

urlpatterns = [
    # Donation endpoints
    path('', views.DonationListView.as_view(), name='donation_list'),
    path('create/', views.DonationCreateView.as_view(), name='donation_create'),
    path('<int:pk>/', views.DonationDetailView.as_view(), name='donation_detail'),
    path('<int:pk>/payment/', views.process_payment, name='process_payment'),
    
    # User's donations
    path('my-donations/', views.UserDonationsView.as_view(), name='my_donations'),
    
    # Donation campaigns
    path('campaigns/', views.DonationCampaignListView.as_view(), name='campaign_list'),
    path('campaigns/create/', views.DonationCampaignCreateView.as_view(), name='campaign_create'),
    path('campaigns/<int:pk>/', views.DonationCampaignDetailView.as_view(), name='campaign_detail'),
    path('campaigns/<int:pk>/update/', views.DonationCampaignUpdateView.as_view(), name='campaign_update'),
    
    # Donation receipts
    path('my-receipts/', views.UserReceiptsView.as_view(), name='my_receipts'),
    path('receipts/<int:pk>/', views.ReceiptDetailView.as_view(), name='receipt_detail'),
    
    # Statistics
    path('statistics/', views.donation_statistics, name='donation_statistics'),
    path('shelters/<int:pk>/statistics/', views.shelter_donation_stats, name='shelter_donation_stats'),
]