import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User

# Delete existing admin user if it exists
User.objects.filter(username='admin').delete()

# Create new superuser
User.objects.create_superuser(
    username='admin',
    email='admin@example.com',
    password='admin123'
)

print("Superuser created successfully!")
print("Username: admin")
print("Password: admin123") 