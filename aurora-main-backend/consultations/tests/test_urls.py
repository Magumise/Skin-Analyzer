from django.test import TestCase
from django.urls import reverse, resolve
from ..views import ConsultationListView, ConsultationDetailView

class ConsultationURLTests(TestCase):
    def test_consultation_list_url_resolves(self):
        """Test that consultation list URL maps to correct view"""
        url = reverse('consultations:consultation-list')
        self.assertEqual(resolve(url).func.view_class, ConsultationListView)
        self.assertEqual(url, '/api/consultations/')  # Updated to include /api/

    def test_consultation_detail_url_resolves(self):
        """Test that consultation detail URL maps to correct view"""
        url = reverse('consultations:consultation-detail', kwargs={'pk': 1})
        self.assertEqual(resolve(url).func.view_class, ConsultationDetailView)
        self.assertEqual(url, '/api/consultations/1/')  # Updated to include /api/

    def test_url_pattern_names(self):
        """Test all URL patterns are named correctly"""
        url_conf = [
            ('consultations:consultation-list', []),
            ('consultations:consultation-detail', [1]),
        ]
        
        for name, args in url_conf:
            try:
                reverse(name, args=args)
            except Exception as e:
                self.fail(f"Failed to reverse URL '{name}': {str(e)}")

    def test_url_trailing_slash(self):
        """Test that URLs end with slashes"""
        patterns = [
            reverse('consultations:consultation-list'),
            reverse('consultations:consultation-detail', kwargs={'pk': 1}),
        ]
        
        for url in patterns:
            self.assertTrue(url.endswith('/'), f"URL '{url}' should end with a slash")

    def test_url_parameter_types(self):
        """Test that URL parameters are properly typed"""
        # Test invalid PK types
        invalid_urls = [
            '/api/consultations/abc/',  # Updated to include /api/
            '/api/consultations/1.5/',  # Updated to include /api/
        ]
        
        for url in invalid_urls:
            response = self.client.get(url)
            self.assertEqual(response.status_code, 404)