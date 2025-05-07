import random
from .models import Product

class ProductMatcher:
    @staticmethod
    def recommend(analysis_data, user_preferences=None):
        """
        Recommends products based on skin analysis and optional user preferences
        
        Args:
            analysis_data (dict): {'conditions': ['dryness', 'acne'], ...}
            user_preferences (dict): {'vegan': True, 'organic': False}
        
        Returns:
            QuerySet: Matching products
        """
        conditions = analysis_data.get('conditions', [])
        
        # Base queryset
        queryset = Product.objects.filter(
            suitable_for__overlap=conditions  # Match any condition
        )
        
        # Apply user preferences if provided
        if user_preferences:
            if user_preferences.get('vegan'):
                queryset = queryset.filter(is_vegan=True)
            if user_preferences.get('organic'):
                queryset = queryset.filter(is_organic=True)
            if user_preferences.get('fragrance_free'):
                queryset = queryset.filter(is_fragrance_free=True)
        
        # Advanced matching - add your AI logic here
        scored_products = []
        for product in queryset:
            score = ProductMatcher._calculate_match_score(product, analysis_data)
            scored_products.append((product, score))
        
        # Sort by score and return top 3
        scored_products.sort(key=lambda x: x[1], reverse=True)
        return [prod for prod, score in scored_products[:3]]

    @staticmethod
    def _calculate_match_score(product, analysis_data):
        """Custom scoring algorithm - modify with your AI logic"""
        score = 0
        
        # 1. Condition matching (basic)
        matched_conditions = set(product.suitable_for) & set(analysis_data['conditions'])
        score += len(matched_conditions) * 10
        
        # 2. Skin type bonus
        if analysis_data.get('skin_type') in product.suitable_for:
            score += 15
        
        # 3. Confidence factor
        for condition in matched_conditions:
            score += analysis_data['confidence_scores'].get(condition, 0) * 5
        
        return score