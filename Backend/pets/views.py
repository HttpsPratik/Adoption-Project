from rest_framework import generics, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from .models import Pet, PetImage, PetFavorite, PetInquiry
from .serializers import (
    PetSerializer, PetListSerializer, MissingPetSerializer,
    PetInquirySerializer, PetFavoriteSerializer, PetImageSerializer
)

class PetListCreateView(generics.ListCreateAPIView):
    """List all pets or create a new pet"""
    queryset = Pet.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'breed', 'description', 'city', 'district']
    filterset_fields = ['type', 'breed', 'age', 'gender', 'size', 'status', 'city', 'district', 'province']
    ordering_fields = ['created_at', 'age', 'name']
    ordering = ['-is_featured', '-created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PetSerializer
        return PetListSerializer

class PetDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a pet"""
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class AdoptablePetListView(generics.ListAPIView):
    """List pets available for adoption"""
    serializer_class = PetListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'breed', 'city', 'district']
    filterset_fields = ['type', 'breed', 'age', 'gender', 'size', 'city', 'district']
    
    def get_queryset(self):
        return Pet.objects.filter(status='adoptable')

class MissingPetListView(generics.ListAPIView):
    """List missing pets"""
    serializer_class = MissingPetSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'breed', 'last_seen_location', 'city', 'district']
    filterset_fields = ['type', 'breed', 'city', 'district']
    
    def get_queryset(self):
        return Pet.objects.filter(status='missing')

class ReportMissingPetView(generics.CreateAPIView):
    """Report a missing pet"""
    serializer_class = MissingPetSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user, status='missing')

class FoundPetListView(generics.ListAPIView):
    """List found pets"""
    serializer_class = MissingPetSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'breed', 'city', 'district']
    
    def get_queryset(self):
        return Pet.objects.filter(status='found')

class MyPetsView(generics.ListAPIView):
    """List current user's pets"""
    serializer_class = PetSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Pet.objects.filter(owner=self.request.user)

class FeaturedPetsView(generics.ListAPIView):
    """List featured pets for homepage"""
    serializer_class = PetListSerializer
    
    def get_queryset(self):
        return Pet.objects.filter(is_featured=True, status='adoptable')[:6]

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_favorite(request, pet_id):
    """Toggle pet favorite status"""
    pet = get_object_or_404(Pet, id=pet_id)
    favorite, created = PetFavorite.objects.get_or_create(
        user=request.user,
        pet=pet
    )
    
    if not created:
        favorite.delete()
        return Response({'favorited': False})
    
    return Response({'favorited': True})

class PetInquiryCreateView(generics.CreateAPIView):
    """Create an inquiry about a pet"""
    serializer_class = PetInquirySerializer
    permission_classes = [IsAuthenticated]

class UserFavoritesView(generics.ListAPIView):
    """List user's favorite pets"""
    serializer_class = PetFavoriteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return PetFavorite.objects.filter(user=self.request.user)

class PetImageUploadView(generics.CreateAPIView):
    """Upload images for a pet"""
    serializer_class = PetImageSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        pet_id = self.kwargs.get('pet_id')
        pet = get_object_or_404(Pet, id=pet_id, owner=self.request.user)
        serializer.save(pet=pet)

@api_view(['GET'])
def pet_stats(request):
    """Get pet statistics for dashboard"""
    stats = {
        'total_pets': Pet.objects.count(),
        'adoptable_pets': Pet.objects.filter(status='adoptable').count(),
        'missing_pets': Pet.objects.filter(status='missing').count(),
        'found_pets': Pet.objects.filter(status='found').count(),
        'adopted_pets': Pet.objects.filter(status='adopted').count(),
    }
    return Response(stats)