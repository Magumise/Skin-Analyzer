from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from users.models import User
from django.utils import timezone
from analysis.models import SkinAnalysis

class SkinAnalysisModelTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        """Create test data that will be shared across all test methods"""
        # Create test user
        cls.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        
        # Sample image file
        cls.mock_image = SimpleUploadedFile(
            "test_skin.jpg",
            b"file_content",
            content_type="image/jpeg"
        )

    def test_analysis_creation(self):
        """Test basic model creation with required fields"""
        analysis = SkinAnalysis.objects.create(
            user=self.user,
            image=self.mock_image
        )
        self.assertEqual(analysis.status, 'PENDING')
        self.assertIsNotNone(analysis.created_at)
        self.assertTrue(timezone.is_aware(analysis.created_at))  # Verify timezone awareness
        self.assertIsNone(analysis.completed_at)
        self.assertEqual(analysis.user.email, 'test@example.com')

    def test_image_upload_path(self):
        """Test custom upload path generation contains user ID"""
        analysis = SkinAnalysis.objects.create(
            user=self.user,
            image=self.mock_image
        )
        self.assertIn(f'user_uploads/{self.user.id}/', analysis.image.name)

    def test_status_flow(self):
        """Test status transitions with timezone-aware timestamps"""
        analysis = SkinAnalysis.objects.create(
            user=self.user,
            image=self.mock_image
        )
        
        # Test status update with timezone-aware datetime
        analysis.status = 'COMPLETED'
        analysis.completed_at = timezone.now()  # Using timezone-aware now()
        analysis.save()
        
        self.assertEqual(analysis.status, 'COMPLETED')
        self.assertIsNotNone(analysis.completed_at)
        self.assertTrue(timezone.is_aware(analysis.completed_at))  # Verify timezone awareness

    def test_ordering(self):
        """Test meta ordering works with timezone-aware datetimes"""
        # Create older analysis (1 day ago)
        SkinAnalysis.objects.create(
            user=self.user,
            image=self.mock_image,
            created_at=timezone.now() - timezone.timedelta(days=1)  # Timezone-aware
        )
        
        # Create recent analysis
        recent_analysis = SkinAnalysis.objects.create(
            user=self.user,
            image=self.mock_image
        )
        
        # Verify ordering (most recent first)
        analyses = SkinAnalysis.objects.all()
        self.assertEqual(analyses[0].id, recent_analysis.id)
        self.assertGreater(
            analyses[0].created_at,
            analyses[1].created_at
        )

    def test_str_representation(self):
        """Test string representation format"""
        analysis = SkinAnalysis.objects.create(
            user=self.user,
            image=self.mock_image
        )
        self.assertEqual(
            str(analysis),
            f"Analysis #{analysis.id} - test@example.com"
        )

    def test_default_results(self):
        """Test JSONField has empty dict as default value"""
        analysis = SkinAnalysis.objects.create(
            user=self.user,
            image=self.mock_image
        )
        self.assertEqual(analysis.results, {})

    def test_invalid_status(self):
        """Test that invalid status choices raise validation error"""
        with self.assertRaises(ValueError):
            analysis = SkinAnalysis(
                user=self.user,
                image=self.mock_image,
                status='INVALID_STATUS'
            )
            analysis.full_clean()  # Explicit validation

    def test_analysis_deletion_cascade(self):
        """Test user deletion cascades to analysis records"""
        analysis = SkinAnalysis.objects.create(
            user=self.user,
            image=self.mock_image
        )
        user_id = self.user.id
        self.user.delete()
        
        # Verify analysis is deleted
        with self.assertRaises(SkinAnalysis.DoesNotExist):
            SkinAnalysis.objects.get(pk=analysis.pk)
            
        # Verify user is deleted
        with self.assertRaises(User.DoesNotExist):
            User.objects.get(pk=user_id)