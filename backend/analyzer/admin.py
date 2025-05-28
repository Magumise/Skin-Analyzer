from django.contrib import admin
from django.contrib.admin.views.decorators import staff_member_required
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.contrib.admin.sites import AdminSite
from .models import UploadedImage, AnalysisResult, Product, Appointment

class CustomAdminSite(AdminSite):
    def has_permission(self, request):
        return True  # Always allow access

    def login(self, request, extra_context=None):
        return self.index(request)  # Skip login and go straight to index

admin_site = CustomAdminSite(name='admin')

# Register models with the custom admin site
admin_site.register(UploadedImage)
admin_site.register(AnalysisResult)
admin_site.register(Product)
admin_site.register(Appointment)
