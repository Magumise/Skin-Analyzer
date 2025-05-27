# backend/create_admin.py
import os
import django
import sys

print("Starting admin user creation script...")

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.db import IntegrityError

User = get_user_model()
username = "admin"
email = "admin@example.com"
password = "admin123"  # You can change this password

try:
    print(f"Checking if user {username} exists...")
    if not User.objects.filter(username=username).exists():
        print(f"Creating superuser with username: {username}")
        User.objects.create_superuser(
            username=username,
            email=email,
            password=password
        )
        print("Superuser created successfully!")
    else:
        print(f"Superuser {username} already exists.")
        # Update the password anyway
        user = User.objects.get(username=username)
        user.set_password(password)
        user.save()
        print("Superuser password has been updated.")
except IntegrityError as e:
    print(f"Error creating superuser: {str(e)}")
    sys.exit(1)
except Exception as e:
    print(f"Unexpected error: {str(e)}")
    sys.exit(1)

print("Admin user creation script completed.")