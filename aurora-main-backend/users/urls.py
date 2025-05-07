from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from users.serializers import CustomTokenObtainPairSerializer
from .views import (
    RegisterView,
    VerifyEmailView,
    PasswordResetView,
    PasswordResetConfirmView,
    TestView
)

urlpatterns = [
    # Test endpoint
    path('test/', TestView.as_view(), name='test'),
    
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(
        serializer_class=CustomTokenObtainPairSerializer
    ), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Email Verification
    path('verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    
    # Password Reset
    path('password-reset/', PasswordResetView.as_view(), name='password-reset'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
]