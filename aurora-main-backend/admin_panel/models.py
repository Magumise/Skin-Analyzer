from django.db import models
from users.models import User

class AdminLog(models.Model):
    ACTION_CHOICES = [
        ('USER_EDIT', 'User Modified'),
        ('CONTENT_DELETE', 'Content Deleted'),
        ('SYSTEM_UPDATE', 'System Config Changed'),
    ]
    
    admin = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    target_id = models.CharField(max_length=100)  # Generic reference
    details = models.JSONField(default=dict)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'Admin Audit Log'


class SystemConfig(models.Model):
    key = models.CharField(max_length=100, unique=True)
    value = models.JSONField()
    last_updated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.key}: {self.value}"