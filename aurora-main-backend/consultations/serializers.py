from rest_framework import serializers
from .models import Consultation
from users.serializers import UserProfileSerializer
from analysis.serializers import SkinAnalysisSerializer

class ConsultationSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    dermatologist = UserProfileSerializer(read_only=True)
    analysis = SkinAnalysisSerializer(read_only=True)

    class Meta:
        model = Consultation
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        # Get relationships from context
        validated_data.update({
            'user': self.context.get('user'),
            'dermatologist': self.context.get('dermatologist'),
            'analysis': self.context.get('analysis')
        })
        
        # Verify all required relationships are provided
        if not all([validated_data.get('user'), 
                   validated_data.get('dermatologist'),
                   validated_data.get('analysis')]):
            raise serializers.ValidationError("Required relationships not provided in context")
            
        return super().create(validated_data)