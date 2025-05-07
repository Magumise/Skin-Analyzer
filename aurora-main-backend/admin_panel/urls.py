from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.AdminUserListView.as_view()),
    path('bulk-action/', views.BulkUserActionView.as_view()),
]