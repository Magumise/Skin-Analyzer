from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render
from users.models import User
from rest_framework import generics, status
from rest_framework.response import Response
from .models import AdminLog
from .serializers import AdminUserSerializer, BulkActionSerializer


class AdminUserListView(generics.ListAPIView):
    serializer_class = AdminUserSerializer
    queryset = User.objects.all()
    
    def get_queryset(self):
        return self.queryset.filter(is_active=True)

class BulkUserActionView(generics.GenericAPIView):
    serializer_class = BulkActionSerializer
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Example: Deactivate users
        if serializer.data['action'] == 'deactivate':
            User.objects.filter(id__in=serializer.data['ids']).update(is_active=False)
            return Response({'status': 'success'})
        
        return Response({'error': 'Invalid action'}, status=400)