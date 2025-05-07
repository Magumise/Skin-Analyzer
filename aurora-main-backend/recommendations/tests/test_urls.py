from django.test import TestCase
from django.urls import resolve, reverse
from ..views import ProductListView, UserRecommendationsView

class UrlTests(TestCase):
    def test_product_list_url(self):
        url = reverse('recommendations:product-list')
        self.assertEqual(resolve(url).func.view_class, ProductListView)

    def test_user_recommendations_url(self):
        url = reverse('recommendations:user-recommendations')
        self.assertEqual(resolve(url).func.view_class, UserRecommendationsView)