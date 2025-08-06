# accounts/views.py
# Replace the existing content with this complete API implementation

from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, logout
from .models import User
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserProfileSerializer,
    UserPublicProfileSerializer,
    ChangePasswordSerializer
)


# ===== AUTHENTICATION VIEWS =====

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    """
    Register a new user
    
    POST /api/accounts/register/
    {
        "username": "john_doe",
        "email": "john@example.com",
        "password": "secure123",
        "password_confirm": "secure123",
        "first_name": "John",
        "last_name": "Doe",
        "location": "New York",
        "is_shelter": false
    }
    """
    serializer = UserRegistrationSerializer(data=request.data)
    
    if serializer.is_valid():
        try:
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            
            user_data = UserProfileSerializer(user).data
            
            return Response({
                'success': True,
                'message': 'User registered successfully!',
                'data': {
                    'user': user_data,
                    'token': token.key
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'success': False,
                'message': 'Registration failed',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({
        'success': False,
        'message': 'Registration failed',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_user(request):
    """
    Login user
    
    POST /api/accounts/login/
    {
        "email": "john@example.com",
        "password": "secure123"
    }
    """
    serializer = UserLoginSerializer(
        data=request.data,
        context={'request': request}
    )
    
    if serializer.is_valid():
        try:
            user = serializer.validated_data['user']
            login(request, user)
            
            token, created = Token.objects.get_or_create(user=user)
            user_data = UserProfileSerializer(user).data
            
            return Response({
                'success': True,
                'message': 'Login successful!',
                'data': {
                    'user': user_data,
                    'token': token.key
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'success': False,
                'message': 'Login failed',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({
        'success': False,
        'message': 'Login failed',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_user(request):
    """
    Logout user
    
    POST /api/accounts/logout/
    Headers: Authorization: Token <token>
    """
    try:
        if hasattr(request.user, 'auth_token'):
            request.user.auth_token.delete()
        
        logout(request)
        
        return Response({
            'success': True,
            'message': 'Logout successful!'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': 'Logout failed',
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def auth_status(request):
    """
    Check authentication status
    
    GET /api/accounts/status/
    """
    if request.user.is_authenticated:
        user_data = UserProfileSerializer(request.user).data
        return Response({
            'success': True,
            'authenticated': True,
            'data': {
                'user': user_data
            }
        })
    
    return Response({
        'success': True,
        'authenticated': False,
        'data': {
            'user': None
        }
    })


# ===== USER PROFILE VIEWS =====

class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Get and update current user's profile
    
    GET /api/accounts/profile/
    PUT /api/accounts/profile/
    PATCH /api/accounts/profile/
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        return Response({
            'success': True,
            'message': 'Profile retrieved successfully',
            'data': {
                'user': serializer.data
            }
        })
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Profile updated successfully!',
                'data': {
                    'user': serializer.data
                }
            })
        
        return Response({
            'success': False,
            'message': 'Profile update failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class UserPublicProfileView(generics.RetrieveAPIView):
    """
    Get public profile of any user
    
    GET /api/accounts/users/{user_id}/
    """
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserPublicProfileSerializer
    permission_classes = [permissions.AllowAny]
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        return Response({
            'success': True,
            'message': 'Public profile retrieved successfully',
            'data': {
                'user': serializer.data
            }
        })


class UserListView(generics.ListAPIView):
    """
    List all users (public profiles)
    
    GET /api/accounts/users/
    Query params: ?is_shelter=true&search=john
    """
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserPublicProfileSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by shelter status
        is_shelter = self.request.query_params.get('is_shelter')
        if is_shelter is not None:
            is_shelter = is_shelter.lower() == 'true'
            queryset = queryset.filter(is_shelter=is_shelter)
        
        # Filter by location
        location = self.request.query_params.get('location')
        if location:
            queryset = queryset.filter(location__icontains=location)
        
        # Search functionality
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                username__icontains=search
            ) | queryset.filter(
                first_name__icontains=search
            ) | queryset.filter(
                last_name__icontains=search
            )
        
        return queryset.order_by('-created_at')
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'success': True,
            'message': 'Users retrieved successfully',
            'data': {
                'count': len(serializer.data),
                'users': serializer.data
            }
        })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def change_password(request):
    """
    Change user password
    
    POST /api/accounts/change-password/
    {
        "old_password": "current_password",
        "new_password": "new_password",
        "new_password_confirm": "new_password"
    }
    """
    serializer = ChangePasswordSerializer(
        data=request.data,
        context={'request': request}
    )
    
    if serializer.is_valid():
        try:
            serializer.save()
            
            return Response({
                'success': True,
                'message': 'Password changed successfully!'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'success': False,
                'message': 'Password change failed',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({
        'success': False,
        'message': 'Password change failed',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)