from django.test import TestCase, override_settings
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User
from ..models import SkinAnalysis

@override_settings(MEDIA_ROOT='/tmp/django_test_media/')
class SkinAnalysisViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email='test@example.com', password='testpass')
        self.client.force_authenticate(user=self.user)
        self.analysis = SkinAnalysis.objects.create(
            user=self.user,
            image=SimpleUploadedFile("test.jpg", b"file_content")
        )

    def test_create_analysis_authenticated(self):
        url = reverse('analyze-image')
        with open('test_image.jpg', 'wb') as f:
            f.write(b"test_image_content")
        
        with open('test_image.jpg', 'rb') as img:
            response = self.client.post(url, {'image': img}, format='multipart')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SkinAnalysis.objects.count(), 2)

    def test_create_analysis_unauthenticated(self):
        self.client.logout()
        url = reverse('analyze-image')
        response = self.client.post(url, {})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_results_authenticated(self):
        url = reverse('analysis-results', args=[self.analysis.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)

    def test_get_results_wrong_user(self):
        other_user = User.objects.create_user(email='other@example.com', password='testpass')
        self.client.force_authenticate(user=other_user)
        url = reverse('analysis-results', args=[self.analysis.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)