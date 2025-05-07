from django.test import TestCase
from django.urls import reverse, resolve
from users.views import RegisterView, ProfileView

class UrlTests(TestCase):
    def test_register_url(self):
        url = reverse('register')
        self.assertEqual(resolve(url).func.view_class, RegisterView)

    def test_profile_url(self):
        url = reverse('profile')
        self.assertEqual(resolve(url).func.view_class, ProfileView)