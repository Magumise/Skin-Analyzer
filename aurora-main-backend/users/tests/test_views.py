from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from rest_framework import status
from users.tokens import account_activation_token  

User = get_user_model()

class PasswordResetTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            is_verified=True
        )

    def test_password_reset_flow(self):
        # Step 1: Request password reset
        reset_url = reverse('password-reset-request')
        response = self.client.post(reset_url, {'email': 'test@example.com'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Step 2: Generate token and UID (fixed lines)
        token = account_activation_token.make_token(self.user)
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))  # Correct encoding

        # Step 3: Submit new password
        confirm_url = reverse('password-reset-confirm')
        response = self.client.post(confirm_url, {
            'uid': uid,
            'token': token,
            'new_password': 'NewSecurePass123!'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)