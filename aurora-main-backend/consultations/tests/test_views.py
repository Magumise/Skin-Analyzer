from django.urls import reverse
from rest_framework.test import APITestCase
from users.models import User
from analysis.models import SkinAnalysis
from ..models import Consultation

class ConsultationViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='user@example.com', password='test123')
        self.derma = User.objects.create_user(email='derma@example.com', password='test123', role='DERMA')
        self.analysis = SkinAnalysis.objects.create(user=self.user)
        self.consultation = Consultation.objects.create(
            user=self.user,
            dermatologist=self.derma,
            analysis=self.analysis
        )

    def test_user_can_list_own_consultations(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('consultations:consultation-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_dermatologist_can_update_status(self):
        self.client.force_authenticate(user=self.derma)
        url = reverse('consultations:consultation-detail', args=[self.consultation.id])
        data = {'status': 'COMPLETED', 'notes': 'Treatment prescribed'}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'COMPLETED')