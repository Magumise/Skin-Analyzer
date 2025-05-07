from django.shortcuts import render
import requests
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.conf import settings
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, UploadedImage, AnalysisResult, Product, Appointment
from .serializers import (
    UserSerializer, UploadedImageSerializer, AnalysisResultSerializer,
    ProductSerializer, AppointmentSerializer
)

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.EMAIL_FIELD

class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer

# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        """
        Allow registration and listing without authentication
        """
        if self.action in ['create', 'list']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        queryset = User.objects.all()
        # Add the last skin condition for each user
        for user in queryset:
            last_analysis = AnalysisResult.objects.filter(user=user).order_by('-timestamp').first()
            if last_analysis:
                user.last_skin_condition = last_analysis.condition
            else:
                user.last_skin_condition = 'No analysis yet'
        return queryset

    def create(self, request, *args, **kwargs):
        """
        Custom create method for user registration
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': serializer.data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        Custom update method to handle user updates
        """
        instance = self.get_object()
        # Only allow users to update their own profile
        if instance != request.user:
            return Response(
                {'error': 'You can only update your own profile'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """
        Custom destroy method to handle user deletion
        """
        instance = self.get_object()
        # Only allow users to delete their own account
        if instance != request.user:
            return Response(
                {'error': 'You can only delete your own account'},
                status=status.HTTP_403_FORBIDDEN
            )
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

class UploadedImageViewSet(viewsets.ModelViewSet):
    queryset = UploadedImage.objects.all()
    serializer_class = UploadedImageSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def analyze(self, request, pk=None):
        image = self.get_object()
        
        try:
            # Open the image file in binary mode
            with open(image.image.path, 'rb') as image_file:
                files = {'file': image_file}
                
                # Log the request
                print(f"Sending image {image.id} to AI model for analysis")
                
                # Call the AI endpoint with increased timeout
                try:
                    response = requests.post(
                        'https://us-central1-aurora-457407.cloudfunctions.net/predict',
                        files=files,
                        timeout=120  # Increased timeout to 120 seconds
                    )
                except requests.exceptions.Timeout:
                    print(f"Timeout error for image {image.id}")
                    return Response(
                        {'error': 'AI model request timed out. The image analysis is taking longer than expected. Please try again with a smaller image or try again later.'},
                        status=status.HTTP_504_GATEWAY_TIMEOUT
                    )
                except requests.exceptions.ConnectionError:
                    print(f"Connection error for image {image.id}")
                    return Response(
                        {'error': 'Could not connect to AI model. Please check your internet connection and try again.'},
                        status=status.HTTP_503_SERVICE_UNAVAILABLE
                    )
                except Exception as e:
                    print(f"Unexpected error for image {image.id}: {str(e)}")
                    return Response(
                        {'error': 'An unexpected error occurred. Please try again.'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
                
                # Log the response
                print(f"AI model response status: {response.status_code}")
                print(f"AI model response: {response.text}")
                
                if response.status_code == 200:
                    try:
                        ai_response = response.json()
                        
                        # Validate required fields
                        required_fields = ['condition', 'confidence', 'recommendation_type']
                        for field in required_fields:
                            if field not in ai_response:
                                raise ValueError(f"Missing required field: {field}")
                        
                        # Create analysis result
                        analysis = AnalysisResult.objects.create(
                            image=image,
                            user=request.user,
                            condition=ai_response['condition'],
                            confidence=ai_response['confidence'],
                            recommendation_type=ai_response['recommendation_type'],
                            message=ai_response.get('message', '')
                        )
                        
                        # If products are recommended, fetch them from our database
                        if 'recommendations' in ai_response:
                            # Extract product names from recommendations
                            product_names = [r.get('Product', '') for r in ai_response['recommendations']]
                            # Filter out empty strings
                            product_names = [name for name in product_names if name]
                            
                            if product_names:
                                # Get products from database that match the recommended names
                                products = Product.objects.filter(name__in=product_names)
                                
                                # Get the condition from the AI response
                                condition = ai_response['condition'].lower()
                                
                                # Filter products based on the condition
                                filtered_products = []
                                for product in products:
                                    # Check if the product's targets or suitable_for contains the condition
                                    if (condition in product.targets.lower() or 
                                        condition in product.suitable_for.lower()):
                                        filtered_products.append(product)
                                
                                # Serialize the filtered products
                                product_data = ProductSerializer(filtered_products, many=True, context={'request': request}).data
                                
                                # Include only the filtered products in the response
                                ai_response['products'] = product_data
                                # Remove the original recommendations since we're using our database products
                                ai_response.pop('recommendations', None)
                        
                        return Response(ai_response)
                    except ValueError as ve:
                        print(f"Validation error: {str(ve)}")
                        return Response(
                            {'error': str(ve)},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    except Exception as e:
                        print(f"Error processing AI response: {str(e)}")
                        return Response(
                            {'error': 'Error processing AI response'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR
                        )
                else:
                    print(f"AI service error: {response.text}")
                    return Response(
                        {'error': 'AI service unavailable'},
                        status=status.HTTP_503_SERVICE_UNAVAILABLE
                    )
                    
        except FileNotFoundError:
            print(f"Image file not found: {image.image.path}")
            return Response(
                {'error': 'Image file not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            print(f"Error analyzing image: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'update_image']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            # Remove image from data if it's not a file
            if 'image' in request.data and not isinstance(request.data['image'], (str, type(None))):
                request.data.pop('image')
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def update_image(self, request, pk=None):
        try:
            product = self.get_object()
            if 'image' not in request.FILES:
                return Response(
                    {'error': 'No image file provided'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            product.image = request.FILES['image']
            product.save()
            
            serializer = self.get_serializer(product)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        if self.request.user.is_staff:
            return Appointment.objects.all()
        return Appointment.objects.filter(user=self.request.user)
