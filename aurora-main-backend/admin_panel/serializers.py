from rest_framework import serializers
from users.models import User
from analysis.models import SkinAnalysis
from consultations.models import Consultation

class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'role', 'is_active',
            'date_joined', 'last_login'
        ]
        read_only_fields = ['date_joined', 'last_login']

class AdminAnalysisSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = SkinAnalysis
        fields = [
            'id', 'user_email', 'image_url',
            'results', 'confidence_scores', 'created_at'
        ]

class BulkActionSerializer(serializers.Serializer):
    ids = serializers.ListField(child=serializers.IntegerField())
    action = serializers.CharField(max_length=50)