from django.urls import path
from .views import ProductListView, UserRecommendationsView, GenerateRecommendationsView

app_name = 'recommendations'

urlpatterns = [
    path('products/', ProductListView.as_view(), name='product-list'),
    path('recommendations/', UserRecommendationsView.as_view(), name='user-recommendations'),
    path(
        'analyze/<int:analysis_id>/recommend/',
        GenerateRecommendationsView.as_view(),
        name='generate-recommendations'
    ),
]