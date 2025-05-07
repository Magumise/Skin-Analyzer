from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from ..models import Product, Recommendation
from ..serializers import ProductSerializer, RecommendationSerializer
from users.models import User
from analysis.models import SkinAnalysis

class ProductSerializerTests(TestCase):
    def test_serialization(self):
        product = Product.objects.create(
            name="Vitamin C Serum",
            category="TREATMENT",
            is_vegan=True
        )
        serializer = ProductSerializer(product)
        self.assertEqual(serializer.data['name'], "Vitamin C Serum")
        self.assertTrue(serializer.data['is_vegan'])

class RecommendationSerializerTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='test@example.com', password='pass123')
        self.product = Product.objects.create(name="Test Product", category="CLEANSER")
        self.analysis = SkinAnalysis.objects.create(user=self.user)
        self.rec = Recommendation.objects.create(
            user=self.user,
            product=self.product,
            analysis=self.analysis,
            reason="Test reason"
        )

    def test_serializer_includes_product(self):
        serializer = RecommendationSerializer(self.rec)
        self.assertEqual(serializer.data['product']['name'], "Test Product")
        self.assertEqual(serializer.data['reason'], "Test reason")