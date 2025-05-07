import os
import django
import csv
from django.contrib.auth import get_user_model
from analysis.models import AnalysisResult
from recommendations.models import Product
from consultations.models import Consultation
from users.models import User

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aurora_skin_analyzer.settings')
django.setup()

def setup_database():
    # Create superuser
    User = get_user_model()
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser(
            username='admin',
            email='admin@aurora.com',
            password='admin123'
        )
        print("Superuser created successfully")

    # Import products from CSV
    current_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(current_dir, '..', 'skincondition_detection-main', 'aurora_products_B.csv')
    
    if os.path.exists(csv_path):
        with open(csv_path, 'r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                if not row['Product']:
                    continue
                
                Product.objects.get_or_create(
                    name=row['Product'],
                    defaults={
                        'brand': 'Aurora Beauty',
                        'category': row['Product'].split()[0] if ' ' in row['Product'] else "Skincare",
                        'description': f"Targets: {row['Targets']}. Suitable for: {row['Suitable for']}. Apply: {row['When to apply']}",
                        'price': 24.99,  # Default price
                        'stock': 50,     # Default stock
                        'suitable_for': row['Suitable for'],
                        'targets': row['Targets'],
                        'when_to_apply': row['When to apply']
                    }
                )
        print("Products imported successfully")
    else:
        print(f"CSV file not found at: {csv_path}")

if __name__ == '__main__':
    setup_database() 