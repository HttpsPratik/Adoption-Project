from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Pet, AdoptionRequest
from .serializers import PetSerializer, MissingPetSerializer, AdoptionRequestSerializer

class PetListView(generics.ListCreateAPIView):
    """List all available pets for adoption or create a new pet"""
    serializer_class = PetSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchBackend, filters.OrderingFilter]
    filterset_fields = ['pet_type', 'size', 'gender', 'province', 'district', 'city', 'is_vaccinated', 'is_neutered']
    search_fields = ['name', 'breed', 'description', 'city', 'district']
    ordering_fields = ['created_at', 'age', 'name']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Pet.objects.filter(status='available', is_active=True)
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class PetDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a pet"""
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [AllowAny]  # Change based on your auth requirements

class MissingPetsListView(generics.ListCreateAPIView):
    """List all missing pets or report a missing pet"""
    serializer_class = MissingPetSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchBackend, filters.OrderingFilter]
    filterset_fields = ['pet_type', 'province', 'district', 'city']
    search_fields = ['name', 'breed', 'last_seen_location', 'description']
    ordering_fields = ['created_at', 'last_seen_date']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Pet.objects.filter(status='missing', is_active=True)
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user, status='missing')

class AdoptionRequestView(generics.ListCreateAPIView):
    """List adoption requests or create a new adoption request"""
    serializer_class = AdoptionRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return AdoptionRequest.objects.all()
        return AdoptionRequest.objects.filter(adopter=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(adopter=self.request.user)

# contact/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import ContactMessage, ContactInfo
from .serializers import ContactMessageSerializer, ContactInfoSerializer

class ContactMessageCreateView(generics.CreateAPIView):
    """Create a new contact message"""
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response({
            'message': 'Your message has been sent successfully! We will get back to you soon.',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)

class ContactInfoView(generics.RetrieveAPIView):
    """Get contact information"""
    serializer_class = ContactInfoSerializer
    permission_classes = [AllowAny]
    
    def get_object(self):
        return ContactInfo.objects.filter(is_active=True).first()

# pets/urls.py
from django.urls import path
from . import views

app_name = 'pets'

urlpatterns = [
    path('', views.PetListView.as_view(), name='pet-list'),
    path('<int:pk>/', views.PetDetailView.as_view(), name='pet-detail'),
    path('missing/', views.MissingPetsListView.as_view(), name='missing-pets'),
    path('adoption-requests/', views.AdoptionRequestView.as_view(), name='adoption-requests'),
]

