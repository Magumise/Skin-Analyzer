import os
import django
from django.contrib.auth.models import User

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def create_superuser():
    # Delete existing superusers
    User.objects.filter(is_superuser=True).delete()
    
    # Create new superuser
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin123'
        )
        print("Superuser created successfully!")
    else:
        print("Superuser already exists!")

if __name__ == '__main__':
    create_superuser() 