from django.urls import path
from django.http import JsonResponse

def pets_list_view(request):
    """Temporary pets API endpoint"""
    # Mock data for now - replace with real API later
    mock_pets = [
        {
            "id": 1,
            "name": "Buddy",
            "pet_type": "dog",
            "breed": "Golden Retriever",
            "age": 24,
            "gender": "male",
            "size": "large",
            "color": "Golden",
            "description": "Friendly and energetic dog",
            "is_vaccinated": True,
            "is_neutered": True,
            "province": "bagmati",
            "district": "Kathmandu",
            "city": "Kathmandu",
            "location_display": "Kathmandu, Kathmandu, Bagmati Province",
            "status": "available",
            "is_active": True,
            "contact_phone": "+977-9841234567",
            "contact_email": "owner@example.com",
            "image": None,
            "created_at": "2024-08-05T10:00:00Z",
            "updated_at": "2024-08-05T10:00:00Z",
            "is_missing": False,
            "is_available_for_adoption": True,
            "owner": {
                "id": 1,
                "username": "testuser",
                "first_name": "Test",
                "last_name": "User",
                "email": "test@example.com"
            }
        }
    ]
    
    return JsonResponse({
        "count": len(mock_pets),
        "results": mock_pets
    })

def missing_pets_view(request):
    """Temporary missing pets API endpoint"""
    return JsonResponse({
        "count": 0,
        "results": []
    })

app_name = 'pets'
urlpatterns = [
    path('', pets_list_view, name='pets-list'),
    path('missing/', missing_pets_view, name='missing-pets'),
]
