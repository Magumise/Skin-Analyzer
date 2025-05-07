from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('api/users/', include('users.urls')),
    path('api/analysis/', include('analysis.urls')),
    path('api/recommendations/', include('recommendations.urls', namespace='recommendations')),
    path('api/consultations/', include('consultations.urls', namespace='consultations')),
    path('api/admin', include('admin_panel.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)