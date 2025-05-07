from rest_framework import serializers
from .models import Product, Recommendation

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

class RecommendationSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    
    class Meta:
        model = Recommendation
        fields = ['id', 'product', 'reason', 'created_at', 'is_viewed']
        read_only_fields = fields