from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def homepage(request):
    """Homepage with complete project info"""
    return JsonResponse({
        'project': 'Adopt Me - Pet Adoption Platform',
        'status': 'Backend is running successfully! 🐾',
        'version': '1.0',
        'description': 'Complete pet adoption platform with shelters, donations, and user management',
        'available_endpoints': {
            # Admin
            'admin': '/admin/',
            
            # API Root
            'api_health': '/api/health/',
            
            # Pets API
            'list_pets': '/api/pets/',
            'missing_pets': '/api/pets/missing/',
            
            # Contact API
            'contact_info': '/api/contact/info/',
            'contact_message': '/api/contact/message/',
        },
        'next_steps': [
            'Test pets API at /api/pets/',
            'Test contact API at /api/contact/info/',
            'Start React frontend with npm run dev',
            'Visit http://localhost:5173 to see the connected app'
        ]
    })

def api_health_check(request):
    """API health check"""
    return JsonResponse({
        'status': 'ok',
        'message': 'Django API is working perfectly!',
        'endpoints_available': [
            '/api/pets/',
            '/api/pets/missing/',
            '/api/contact/info/',
            '/api/contact/message/'
        ]
    })

urlpatterns = [
    # Homepage
    path('', homepage, name='homepage'),
    
    # Admin
    path('admin/', admin.site.urls),
    
    # API
    path('api/health/', api_health_check, name='api-health'),
    path('api/pets/', include('pets.urls')),
    path('api/contact/', include('contact.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)