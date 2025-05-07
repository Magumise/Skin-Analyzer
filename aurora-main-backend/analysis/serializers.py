from rest_framework import serializers
from .models import SkinAnalysis

class SkinAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkinAnalysis
        fields = ['id', 'image', 'status', 'created_at']
        read_only_fields = ['status', 'created_at']

class AnalysisResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkinAnalysis
        fields = ['results', 'completed_at']
        read_only_fields = fields