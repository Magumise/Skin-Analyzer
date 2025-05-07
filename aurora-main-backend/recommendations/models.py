from django.db import models
from users.models import User
from analysis.models import SkinAnalysis

class Product(models.Model):
    CATEGORIES = (
        ('CLEANSER', 'Cleanser'),
        ('MOISTURIZER', 'Moisturizer'),
        ('SUNSCREEN', 'Sunscreen'),
        ('TREATMENT', 'Treatment'),
    )
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORIES)
    ingredients = models.TextField()
    suitable_for = models.JSONField(default=list)  # List of skin conditions
    is_vegan = models.BooleanField(default=False)
    is_organic = models.BooleanField(default=False)
    is_fragrance_free = models.BooleanField(default=False)
    image_url = models.URLField(blank=True)

    def __str__(self):
        return f"{self.get_category_display()}: {self.name}"

class Recommendation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    analysis = models.ForeignKey(SkinAnalysis, on_delete=models.CASCADE)
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_viewed = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Rec #{self.id} for {self.user.email}"