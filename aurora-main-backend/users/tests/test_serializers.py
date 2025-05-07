from django.test import TestCase
from users.serializers import UserRegisterSerializer
from users.models import User

class UserSerializerTests(TestCase):
    def test_serializer_validation(self):
        # Valid data
        valid_data = {
            'email': 'valid@example.com',
            'username': 'validuser',
            'password': 'ValidPass123!'
        }
        serializer = UserRegisterSerializer(data=valid_data)
        self.assertTrue(serializer.is_valid())

        # Invalid data
        invalid_data = {
            'email': 'invalid',
            'password': 'short'
        }
        serializer = UserRegisterSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(len(serializer.errors), 2)