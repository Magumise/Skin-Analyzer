from django.test import TestCase
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import get_user_model
from ..serializers import ConsultationSerializer
from ..models import Consultation
from analysis.models import SkinAnalysis

User = get_user_model()

class ConsultationSerializerTest(TestCase):
    def setUp(self):
        # Create test users
        self.user = User.objects.create_user(
            email='patient@test.com',
            password='testpass123',
            role='USER'
        )
        self.dermatologist = User.objects.create_user(
            email='derm@test.com',
            password='testpass123',
            role='DERMA'
        )
        
        # Create test analysis
        self.analysis = SkinAnalysis.objects.create(
            user=self.user,
            image='path/to/image.jpg'
        )
        
        # Create test consultation
        self.consultation = Consultation.objects.create(
            user=self.user,
            dermatologist=self.dermatologist,
            analysis=self.analysis,
            status='REQUESTED',
            scheduled_time=timezone.now() + timedelta(days=1),
            notes='Initial consultation'
        )

    def test_serializer_output_structure(self):
        """Test that serialization produces correct fields"""
        serializer = ConsultationSerializer(self.consultation)
        data = serializer.data
        
        self.assertEqual(
            set(data.keys()),
            {
                'id', 'user', 'dermatologist', 'analysis', 
                'status', 'scheduled_time', 'notes',
                'created_at', 'updated_at'
            }
        )
        self.assertEqual(data['status'], 'REQUESTED')
        self.assertEqual(data['user']['email'], 'patient@test.com')
        self.assertEqual(data['dermatologist']['email'], 'derm@test.com')

    def test_valid_status_transitions(self):
        """Test all valid status choices"""
        valid_statuses = ['REQUESTED', 'SCHEDULED', 'COMPLETED', 'CANCELLED']
        
        for status in valid_statuses:
            data = {'status': status}
            serializer = ConsultationSerializer(
                instance=self.consultation,
                data=data,
                partial=True
            )
            self.assertTrue(serializer.is_valid(), 
                          f"Status {status} should be valid. Errors: {serializer.errors}")
            serializer.save()
            self.assertEqual(self.consultation.status, status)

    def test_create_consultation(self):
        """Test creating new consultation with context-provided relationships"""
        data = {
            'status': 'REQUESTED',
            'scheduled_time': timezone.now() + timedelta(days=2),
            'notes': 'New consultation'
        }

        serializer = ConsultationSerializer(
            data=data,
            context={
                'user': self.user,
                'dermatologist': self.dermatologist,
                'analysis': self.analysis
            }
        )

            # Validate
        self.assertTrue(serializer.is_valid(), serializer.errors)

        # Create and verify
        consultation = serializer.save()
        self.assertEqual(consultation.status, 'REQUESTED')
        self.assertEqual(consultation.user, self.user)
        self.assertEqual(consultation.dermatologist, self.dermatologist)
        self.assertEqual(consultation.analysis, self.analysis)

        # Verify the object was properly saved to DB
        consultation.refresh_from_db()
        self.assertIsNotNone(consultation.id)

    def test_read_only_fields(self):
        """Test that read-only fields cannot be modified through serializer"""
        new_user = User.objects.create_user(
            email='new@test.com',
            password='testpass123',
            role='USER'
        )
        
        data = {
            'user': new_user.id,  # Should be ignored
            'status': 'SCHEDULED',
            'notes': 'Updated notes'
        }
        
        serializer = ConsultationSerializer(
            instance=self.consultation,
            data=data,
            partial=True
        )
        
        self.assertTrue(serializer.is_valid(), serializer.errors)
        updated = serializer.save()
        # Verify read-only field wasn't changed
        self.assertEqual(updated.user.id, self.user.id)
        # Verify other fields were updated
        self.assertEqual(updated.status, 'SCHEDULED')