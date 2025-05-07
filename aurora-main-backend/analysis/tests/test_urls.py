from django.test import TestCase
from django.urls import resolve, reverse
from ..views import SkinAnalysisCreateView, AnalysisResultsView

class AnalysisURLTests(TestCase):
    def test_analyze_url_resolves(self):
        url = reverse('analyze-image')
        self.assertEqual(
            resolve(url).func.view_class, 
            SkinAnalysisCreateView
        )

    def test_results_url_resolves(self):
        url = reverse('analysis-results', args=[1])
        self.assertEqual(
            resolve(url).func.view_class,
            AnalysisResultsView
        )

    def test_url_names(self):
        analyze_url = reverse('analyze-image')
        results_url = reverse('analysis-results', args=[1])
        self.assertIn('/analyze/', analyze_url)
        self.assertIn('/results/1/', results_url)