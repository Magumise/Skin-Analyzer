from rest_framework.permissions import BasePermission

class IsOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        return obj.user == request.user or request.user.role == 'ADMIN'


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'ADMIN'

class IsDermatologist(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'DERMA'

class IsRegularUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'USER'