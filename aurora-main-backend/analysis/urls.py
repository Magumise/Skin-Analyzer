from django.urls import path
from .views import SkinAnalysisView

urlpatterns = [
    path('analyze/', SkinAnalysisView.as_view(), name='analyze-image'),
]