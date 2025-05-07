from django.urls import path
from .views import ConsultationListView, ConsultationDetailView

app_name = 'consultations'

urlpatterns = [
    path('', ConsultationListView.as_view(), name='consultation-list'),
    path('<int:pk>/', ConsultationDetailView.as_view(), name='consultation-detail'),
]