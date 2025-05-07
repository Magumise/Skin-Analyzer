from rest_framework import generics, permissions
from .models import Consultation
from .serializers import ConsultationSerializer
from users.permissions import IsDermatologist, IsOwnerOrAdmin
from rest_framework.exceptions import PermissionDenied


class ConsultationListView(generics.ListCreateAPIView):
    serializer_class = ConsultationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'DERMA':
            return Consultation.objects.filter(dermatologist=user)
        return Consultation.objects.filter(user=user)

    def perform_create(self, serializer):
        if self.request.user.role != 'USER':
            raise PermissionDenied("Only users can request consultations")
        serializer.save(user=self.request.user)

class ConsultationDetailView(generics.RetrieveUpdateAPIView):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer
    permission_classes = [IsOwnerOrAdmin | IsDermatologist]

    def perform_update(self, serializer):
        instance = self.get_object()
        if self.request.user.role == 'DERMA':
            serializer.save(dermatologist=self.request.user)
        else:
            serializer.save()