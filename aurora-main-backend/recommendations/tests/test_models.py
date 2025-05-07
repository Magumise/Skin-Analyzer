from django.test import TestCase
from django.utils import timezone
from users.models import User
from analysis.models import SkinAnalysis
from ..models import Product, Recommendation

class ProductModelTests(TestCase):
    def test_product_creation(self):
        product = Product.objects.create(
            name="Hydrating Serum",
            category="TREATMENT",
            ingredients="Hyaluronic Acid",
            suitable_for=["dryness"]
        )
        self.assertEqual(str(product), "Treatment: Hydrating Serum")
        self.assertEqual(product.suitable_for, ["dryness"])

class RecommendationModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='test@example.com', password='pass123')
        self.analysis = SkinAnalysis.objects.create(user=self.user, results={"conditions": ["dryness"]})
        self.product = Product.objects.create(name="Test Product", category="MOISTURIZER")

    def test_recommendation_creation(self):
        rec = Recommendation.objects.create(
            user=self.user,
            product=self.product,
            analysis=self.analysis,
            reason="For dry skin"
        )
        self.assertFalse(rec.is_viewed)
        self.assertEqual(rec.product.category, "MOISTURIZER")
        self.assertTrue(timezone.now() - rec.created_at < timezone.timedelta(seconds=1))