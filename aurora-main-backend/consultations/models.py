from django.db import models
from users.models import User
from analysis.models import SkinAnalysis

class Consultation(models.Model):
    STATUS_CHOICES = (
        ('REQUESTED', 'Requested'),
        ('SCHEDULED', 'Scheduled'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patient_consultations')
    dermatologist = models.ForeignKey(User, on_delete=models.CASCADE, related_name='doctor_consultations')
    analysis = models.ForeignKey(SkinAnalysis, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='REQUESTED')
    scheduled_time = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-scheduled_time']
        permissions = [
            ("can_manage_consultation", "Can manage all consultations"),
        ]

    def __str__(self):
        return f"Consultation #{self.id} - {self.user.email}"