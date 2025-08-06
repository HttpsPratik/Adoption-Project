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
        contact_info = ContactInfo.objects.filter(is_active=True).first()
        if not contact_info:
            # Create default contact info if none exists
            contact_info = ContactInfo.objects.create(
                organization_name="AdoptAPet Nepal",
                tagline="Connecting hearts, saving lives",
                phone_primary="+977-1-4234567",
                email_primary="info@adoptapet.np",
                address_line_1="Baneshwor",
                city="Kathmandu",
                district="Kathmandu",
                province="Bagmati Province"
            )
        return contact_info