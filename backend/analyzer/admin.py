from django.contrib import admin
from django.contrib.admin.views.decorators import staff_member_required
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.contrib.admin.sites import AdminSite
from django.contrib.auth.models import User, Group
from .models import UploadedImage, AnalysisResult, Product, Appointment

class CustomAdminSite(AdminSite):
    def has_permission(self, request):
        # Always return True to allow access
        return True

    def login(self, request, extra_context=None):
        # Skip login and go straight to index
        return self.index(request)

    def get_app_list(self, request):
        # Return all apps and models
        return self._registry.keys()

admin_site = CustomAdminSite(name='admin')

# Register all models with the custom admin site
admin_site.register(User)
admin_site.register(Group)
admin_site.register(UploadedImage)
admin_site.register(AnalysisResult)
admin_site.register(Product)
admin_site.register(Appointment)

# Configure admin site
admin_site.site_header = "AI Skin Analyzer Admin"
admin_site.site_title = "AI Skin Analyzer Admin Portal"
admin_site.index_title = "Welcome to AI Skin Analyzer Admin Portal"
