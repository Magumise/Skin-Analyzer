from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'images', views.UploadedImageViewSet, basename='image')
router.register(r'analysis', views.AnalysisResultViewSet, basename='analysis')
router.register(r'products', views.ProductViewSet, basename='product')
router.register(r'appointments', views.AppointmentViewSet, basename='appointment')

urlpatterns = [
    path('', views.root_view, name='root'),
    path('api/', include(router.urls)),
] 