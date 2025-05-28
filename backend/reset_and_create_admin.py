import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.db import connection

User = get_user_model()

# Delete all existing users
print("Deleting all existing users...")
User.objects.all().delete()

# Reset the primary key sequence
with connection.cursor() as cursor:
    cursor.execute("ALTER SEQUENCE auth_user_id_seq RESTART WITH 1;")

# Create new superuser
print("Creating new superuser...")
User.objects.create_superuser(
    username='admin',
    email='admin@example.com',
    password='admin123'
)

# Verify the superuser was created
user = User.objects.get(username='admin')
print(f"Superuser created successfully!")
print(f"Username: {user.username}")
print(f"Email: {user.email}")
print(f"Is superuser: {user.is_superuser}")
print(f"Is staff: {user.is_staff}")
print(f"Is active: {user.is_active}") 