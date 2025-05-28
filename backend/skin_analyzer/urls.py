from django.urls import path
from . import views

urlpatterns = [
    path('admin-login-test/', views.admin_login_test, name='admin_login_test'),
] 