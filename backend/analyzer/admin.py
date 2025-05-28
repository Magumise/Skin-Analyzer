from django.contrib import admin
from django.contrib.admin.views.decorators import staff_member_required
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.contrib.admin.sites import AdminSite
from django.contrib.auth.models import User, Group
from django.contrib.auth import get_user_model
from .models import UploadedImage, AnalysisResult, Product, Appointment

class UploadedImageAdmin(admin.ModelAdmin):
    list_display = ('user', 'uploaded_at', 'image')
    list_filter = ('uploaded_at',)
    search_fields = ('user__username',)

class AnalysisResultAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'image')
    list_filter = ('created_at',)
    search_fields = ('user__username',)

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'description')

class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'status', 'created_at')
    list_filter = ('status', 'date', 'created_at')
    search_fields = ('user__username',)

class CustomAdminSite(AdminSite):
    def has_permission(self, request):
        # Create a superuser if none exists
        User = get_user_model()
        if not User.objects.filter(is_superuser=True).exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@example.com',
                password='admin123'
            )
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
admin_site.register(UploadedImage, UploadedImageAdmin)
admin_site.register(AnalysisResult, AnalysisResultAdmin)
admin_site.register(Product, ProductAdmin)
admin_site.register(Appointment, AppointmentAdmin)

# Configure admin site
admin_site.site_header = "AI Skin Analyzer Admin"
admin_site.site_title = "AI Skin Analyzer Admin Portal"
admin_site.index_title = "Welcome to AI Skin Analyzer Admin Portal"
