from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
import requests
from django.conf import settings
from .models import SkinAnalysis
from .serializers import SkinAnalysisSerializer, AnalysisResultSerializer
from users.permissions import IsOwnerOrAdmin

class SkinAnalysisView(generics.CreateAPIView):
    queryset = SkinAnalysis.objects.all()
    serializer_class = SkinAnalysisSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Save the analysis with pending status
        analysis = serializer.save(user=request.user, status='PENDING')
        
        try:
            # Send image to AI service
            files = {'file': request.FILES['image']}
            response = requests.post(settings.AI_SERVICE_URL, files=files)
            
            if response.status_code == 200:
                # Update analysis with results
                analysis.results = response.json()
                analysis.status = 'COMPLETED'
                analysis.save()
                
                return Response({
                    'id': analysis.id,
                    'status': analysis.status,
                    'results': analysis.results
                }, status=status.HTTP_201_CREATED)
            else:
                analysis.status = 'FAILED'
                analysis.save()
                return Response({
                    'error': 'AI service failed to process image'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        except Exception as e:
            analysis.status = 'FAILED'
            analysis.save()
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserAnalysesView(generics.ListAPIView):
    serializer_class = SkinAnalysisSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SkinAnalysis.objects.filter(user=self.request.user).order_by('-created_at')
