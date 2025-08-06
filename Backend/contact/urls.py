from django.urls import path
from django.http import JsonResponse

def contact_info_view(request):
    """Temporary contact info API endpoint"""
    mock_contact_info = {
        "id": 1,
        "organization_name": "AdoptAPet Nepal",
        "tagline": "Connecting hearts, saving lives",
        "phone_primary": "+977-1-4234567",
        "phone_secondary": "+977-9841234567",
        "email_primary": "info@adoptapet.np",
        "email_secondary": "support@adoptapet.np",
        "address_line_1": "Baneshwor Road",
        "address_line_2": "Near New Bus Park",
        "city": "Kathmandu",
        "district": "Kathmandu",
        "province": "Bagmati Province",
        "postal_code": "44600",
        "office_hours": "Sunday-Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM",
        "emergency_phone": "+977-9801234567",
        "facebook_url": "https://facebook.com/adoptapetnepal",
        "instagram_url": "https://instagram.com/adoptapetnepal",
        "twitter_url": "https://twitter.com/adoptapetnepal"
    }
    
    return JsonResponse(mock_contact_info)

def contact_message_view(request):
    """Temporary contact message API endpoint"""
    if request.method == 'POST':
        return JsonResponse({
            "message": "Your message has been sent successfully! We will get back to you soon.",
            "data": {
                "id": 1,
                "name": "Test User",
                "email": "test@example.com",
                "subject": "general",
                "message": "Test message",
                "status": "new",
                "created_at": "2024-08-05T10:00:00Z"
            }
        })
    
    return JsonResponse({"error": "Only POST method allowed"}, status=405)

app_name = 'contact'
urlpatterns = [
    path('info/', contact_info_view, name='contact-info'),
    path('message/', contact_message_view, name='contact-message'),
]
