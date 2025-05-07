from django.test import TestCase
from django.contrib.auth import get_user_model
from users.tokens import account_activation_token

User = get_user_model()

class UserModelTests(TestCase):
    def test_create_user(self):
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            username='testuser'
        )
        self.assertEqual(user.email, 'test@example.com')
        self.assertFalse(user.is_verified)
        self.assertEqual(user.role, 'USER')  # Default role

    def test_create_superuser(self):
        admin = User.objects.create_superuser(
            email='admin@example.com',
            password='adminpass123'
        )
        self.assertTrue(admin.is_superuser)
        self.assertEqual(admin.role, 'ADMIN')

    def test_email_normalization(self):
        user = User.objects.create_user(
            email='Test@EXAMPLE.com',
            password='test123'
        )
        self.assertEqual(user.email, 'Test@example.com')