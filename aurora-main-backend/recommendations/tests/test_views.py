from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from users.models import User
from analysis.models import SkinAnalysis
from ..models import Product, Recommendation

class ProductListViewTests(APITestCase):
    def setUp(self):
        self.product = Product.objects.create(
            name="SPF 50 Sunscreen",
            category="SUNSCREEN"
        )
        self.url = reverse('recommendations:product-list')

    def test_product_list(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "SPF 50 Sunscreen")

class UserRecommendationsViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='user@example.com', password='pass123')
        self.client.force_authenticate(user=self.user)
        self.analysis = SkinAnalysis.objects.create(
            user=self.user,
            results={"conditions": ["acne"]}
        )
        self.product = Product.objects.create(
            name="Acne Treatment",
            category="TREATMENT",
            suitable_for=["acne"]
        )
        self.rec = Recommendation.objects.create(
            user=self.user,
            product=self.product,
            analysis=self.analysis,
            reason="For acne"
        )
        self.url = reverse('recommendations:user-recommendations')

    def test_authenticated_access(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['product']['name'], "Acne Treatment")

    def test_unauthenticated_access(self):
        self.client.logout()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
