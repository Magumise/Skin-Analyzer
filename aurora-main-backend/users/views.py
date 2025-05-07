from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from .models import User
from .serializers import (
    UserRegisterSerializer,
    CustomTokenObtainPairSerializer,
    PasswordResetSerializer,
    PasswordResetConfirmSerializer
)
from .tokens import account_activation_token
from rest_framework_simplejwt.tokens import RefreshToken

class TestView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request):
        return Response({"message": "Test endpoint working!"})

class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            "user": serializer.data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            uid = force_str(urlsafe_base64_decode(request.data.get('uid')))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user and account_activation_token.check_token(user, request.data.get('token')):
            user.is_verified = True
            user.save()
            return Response({"detail": "Email verified successfully"})
        return Response({"detail": "Invalid verification link"}, status=400)

class PasswordResetView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            if User.objects.filter(email=email).exists():
                user = User.objects.get(email=email)
                self._send_password_reset_email(user, request)
            return Response({"detail": "If this email exists, a reset link was sent"})
        return Response(serializer.errors, status=400)

    def _send_password_reset_email(self, user, request):
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        subject = "Password Reset Request"
        message = render_to_string('emails/password_reset.html', {
            'user': user,
            'domain': request.get_host(),
            'uid': uid,
            'token': token,
        })
        send_mail(subject, message, None, [user.email])

class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            try:
                uid = force_str(urlsafe_base64_decode(serializer.validated_data['uid']))
                user = User.objects.get(pk=uid)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                user = None

            if user and default_token_generator.check_token(user, serializer.validated_data['token']):
                user.set_password(serializer.validated_data['new_password'])
                user.save()
                return Response({"detail": "Password reset successful"})
        return Response({"detail": "Invalid reset link"}, status=400)