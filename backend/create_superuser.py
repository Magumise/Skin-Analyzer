import os
import django
from django.core.management import call_command

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Create superuser using Django's built-in command
call_command('createsuperuser', 
            username='admin',
            email='admin@example.com',
            interactive=False) 