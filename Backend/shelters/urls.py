# shelters/urls.py
# Create this new file for shelters URL patterns

from django.urls import path
from . import views

app_name = 'shelters'

urlpatterns = [
    # Shelter listing endpoints
    path('', views.ShelterListView.as_view(), name='shelter_list'),
    path('create/', views.ShelterCreateView.as_view(), name='shelter_create'),
    path('<int:pk>/', views.ShelterDetailView.as_view(), name='shelter_detail'),
    path('<int:pk>/update/', views.ShelterUpdateView.as_view(), name='shelter_update'),
    
    # Shelter reviews
    path('<int:pk>/reviews/', views.ShelterReviewListView.as_view(), name='shelter_reviews'),
    path('<int:pk>/reviews/create/', views.ShelterReviewCreateView.as_view(), name='create_review'),
    
    # Volunteer applications
    path('<int:pk>/volunteer/apply/', views.ShelterVolunteerApplicationView.as_view(), name='apply_volunteer'),
    path('my-volunteer-applications/', views.UserVolunteerApplicationsView.as_view(), name='my_volunteer_apps'),
    
    # Shelter images
    path('<int:pk>/images/upload/', views.ShelterImageUploadView.as_view(), name='upload_image'),
    
    # Shelter pets
    path('<int:pk>/pets/', views.shelter_pets, name='shelter_pets'),
    
    # Statistics
    path('statistics/', views.shelter_statistics, name='shelter_statistics'),
]