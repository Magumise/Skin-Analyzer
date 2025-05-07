from django.db import models
from users.models import User

def user_upload_path(instance, filename):
    return f'user_uploads/{instance.user.id}/{filename}'

class SkinAnalysis(models.Model):
    ANALYSIS_STATUS = (
        ('PENDING', 'Pending'),
        ('PROCESSING', 'Processing'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=user_upload_path)
    results = models.JSONField(default=dict)
    status = models.CharField(max_length=10, choices=ANALYSIS_STATUS, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name_plural = "Skin Analyses"
        ordering = ['-created_at']

    def __str__(self):
        return f"Analysis #{self.id} - {self.user.email}"