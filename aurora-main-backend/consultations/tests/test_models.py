from django.test import TestCase
from django.utils import timezone
from users.models import User
from analysis.models import SkinAnalysis
from ..models import Consultation

class ConsultationModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='patient@example.com', password='test123')
        self.derma = User.objects.create_user(email='derma@example.com', password='test123', role='DERMA')
        self.analysis = SkinAnalysis.objects.create(user=self.user)

    def test_consultation_creation(self):
        consultation = Consultation.objects.create(
            user=self.user,
            dermatologist=self.derma,
            analysis=self.analysis,
            status='SCHEDULED',
            scheduled_time=timezone.now()
        )
        self.assertEqual(consultation.status, 'SCHEDULED')
        self.assertEqual(consultation.user.email, 'patient@example.com')