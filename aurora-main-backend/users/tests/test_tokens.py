from django.test import TestCase
from users.models import User
from users.tokens import account_activation_token

class TokenTests(TestCase):
    def test_token_generation(self):
        user = User.objects.create_user(
            email='token@example.com',
            password='testpass'
        )
        token1 = account_activation_token.make_token(user)
        token2 = account_activation_token.make_token(user)
        self.assertEqual(token1, token2)  # Same user/timestamp

    def test_token_validation(self):
        user = User.objects.create_user(
            email='verify@example.com',
            password='testpass'
        )
        token = account_activation_token.make_token(user)
        self.assertTrue(account_activation_token.check_token(user, token))