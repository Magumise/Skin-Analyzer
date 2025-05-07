from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

@api_view(['GET'])
@permission_classes([AllowAny])
def root_view(request):
    return Response({
        "status": "success",
        "message": "Welcome to AI Skin Analyzer API",
        "version": "1.0.0",
        "endpoints": {
            "authentication": {
                "register": {
                    "url": "/api/users/register/",
                    "method": "POST",
                    "description": "Register a new user"
                },
                "login": {
                    "url": "/api/users/login/",
                    "method": "POST",
                    "description": "Login and get JWT tokens"
                },
                "test": {
                    "url": "/api/users/test/",
                    "method": "GET",
                    "description": "Test endpoint to verify API is working"
                }
            },
            "analysis": {
                "analyze": {
                    "url": "/api/analysis/analyze/",
                    "method": "POST",
                    "description": "Analyze skin image (requires authentication)"
                }
            }
        },
        "documentation": "For detailed API documentation, please refer to the project repository"
    })

urlpatterns = [
    path('', root_view, name='root'),
    path('admin/', admin.site.urls),
    
    path('api/users/', include('users.urls')),
    path('api/analysis/', include('analysis.urls')),
    path('api/recommendations/', include('recommendations.urls', namespace='recommendations')),
    path('api/consultations/', include('consultations.urls', namespace='consultations')),
    path('api/admin', include('admin_panel.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)