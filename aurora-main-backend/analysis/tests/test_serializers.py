from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.exceptions import ValidationError
from users.models import User
from ..serializers import SkinAnalysisSerializer, AnalysisResultSerializer

class SkinAnalysisSerializerTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='test@example.com', password='testpass')
        self.valid_data = {
            'image': SimpleUploadedFile("test.jpg", b"file_content"),
        }

    def test_valid_serializer(self):
        serializer = SkinAnalysisSerializer(data=self.valid_data, context={'request': None})
        self.assertTrue(serializer.is_valid())
        analysis = serializer.save(user=self.user)
        self.assertEqual(analysis.user.email, 'test@example.com')

    def test_missing_image(self):
        invalid_data = {}
        serializer = SkinAnalysisSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('image', serializer.errors)

    def test_invalid_image_format(self):
        invalid_data = {'image': SimpleUploadedFile("test.txt", b"not_an_image")}
        serializer = SkinAnalysisSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('image', serializer.errors)

class AnalysisResultSerializerTests(TestCase):
    def test_read_only_fields(self):
        serializer = AnalysisResultSerializer()
        self.assertEqual(
            set(serializer.fields.keys()),
            {'results', 'completed_at'}
        )
        for field in serializer.fields.values():
            self.assertTrue(field.read_only)