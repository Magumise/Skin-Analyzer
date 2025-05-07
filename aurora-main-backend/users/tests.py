from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()

class BasicUserTests(TestCase):
    """Tests that don't require complex setup"""
    def test_user_model_creation(self):
        user = User.objects.create_user(
            email='basic@example.com',
            password='testpass123'
        )
        self.assertEqual(user.email, 'basic@example.com')
        self.assertEqual(user.role, 'USER')  # Testing default role

class AuthFlowTests(TestCase):
    """Tests for authentication workflows"""
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            is_verified=True
        )

    def test_successful_login(self):
        url = reverse('login')
        response = self.client.post(url, {
            'email': 'test@example.com',
            'password': 'testpass123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_failed_login(self):
        url = reverse('login')
        response = self.client.post(url, {
            'email': 'test@example.com',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)