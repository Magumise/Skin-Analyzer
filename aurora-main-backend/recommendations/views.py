from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Product, Recommendation
from .serializers import ProductSerializer, RecommendationSerializer
from analysis.models import SkinAnalysis
from .matcher import ProductMatcher
from users.permissions import IsOwnerOrAdmin

class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

class RecommendationListView(generics.ListAPIView):
    serializer_class = RecommendationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Recommendation.objects.filter(user=self.request.user).order_by('-created_at')

class CreateRecommendationView(generics.CreateAPIView):
    serializer_class = RecommendationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        analysis_id = request.data.get('analysis_id')
        try:
            analysis = SkinAnalysis.objects.get(id=analysis_id, user=request.user)
            
            # Get products based on analysis results
            products = Product.objects.filter(
                suitable_for__contains=[analysis.results.get('condition', '')]
            )[:3]  # Get top 3 products
            
            recommendations = []
            for product in products:
                recommendation = Recommendation.objects.create(
                    user=request.user,
                    product=product,
                    analysis=analysis,
                    reason=f"Recommended based on your skin condition: {analysis.results.get('condition', '')}"
                )
                recommendations.append(recommendation)
            
            serializer = self.get_serializer(recommendations, many=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except SkinAnalysis.DoesNotExist:
            return Response(
                {"error": "Analysis not found"},
                status=status.HTTP_404_NOT_FOUND
            )

class UserRecommendationsView(generics.ListAPIView):
    serializer_class = RecommendationSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        return Recommendation.objects.filter(
            user=self.request.user
        ).select_related('product', 'analysis')
    

class GenerateRecommendationsView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, analysis_id):
        try:
            analysis = SkinAnalysis.objects.get(
                id=analysis_id,
                user=request.user  # Ensure ownership
            )
            
            # Get recommendations
            products = ProductMatcher.recommend(
                analysis_data=analysis.results,
                user_preferences=request.data.get('preferences')
            )
            
            # Create recommendation records
            created_recs = []
            for product in products:
                rec = Recommendation.objects.create(
                    user=request.user,
                    product=product,
                    analysis=analysis,
                    reason=f"Recommended for {', '.join(analysis.results['conditions'])}"
                )
                created_recs.append(rec)
            
            # Return serialized results
            serializer = RecommendationSerializer(created_recs, many=True)
            return Response(serializer.data)
            
        except SkinAnalysis.DoesNotExist:
            return Response(
                {"error": "Analysis not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
