from django.contrib import admin
from .models import UploadedImage, AnalysisResult, Product, Appointment

@admin.register(UploadedImage)
class UploadedImageAdmin(admin.ModelAdmin):
    list_display = ('user', 'uploaded_at', 'image')
    list_filter = ('uploaded_at',)
    search_fields = ('user__username',)
    ordering = ('-uploaded_at',)

@admin.register(AnalysisResult)
class AnalysisResultAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'image')
    list_filter = ('created_at',)
    search_fields = ('user__username',)
    ordering = ('-created_at',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'description')
    ordering = ('name',)

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'status', 'created_at')
    list_filter = ('status', 'date', 'created_at')
    search_fields = ('user__username',)
    ordering = ('-date',)

# Configure admin site
admin.site.site_header = "AI Skin Analyzer Admin"
admin.site.site_title = "AI Skin Analyzer Admin Portal"
admin.site.index_title = "Welcome to AI Skin Analyzer Admin Portal"
