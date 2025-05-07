from django.contrib import admin
from .models import AdminLog, SystemConfig

@admin.register(AdminLog)
class AdminLogAdmin(admin.ModelAdmin):
    list_display = ('admin', 'action', 'timestamp')
    list_filter = ('action', 'timestamp')
    search_fields = ('admin__email', 'target_id')
    readonly_fields = ('timestamp',)

@admin.register(SystemConfig)
class SystemConfigAdmin(admin.ModelAdmin):
    list_display = ('key', 'value', 'last_updated')  
    search_fields = ('key',)
    list_editable = ('value',)  