from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    notes = models.CharField(max_length=200, help_text="e.g. Floral · Fresh · Calm")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity_info = models.CharField(max_length=100, help_text="e.g. 1 Bottle")
    shipping_info = models.CharField(max_length=200, help_text="e.g. Free shipping (North Emirates)")
    description = models.TextField()
    main_image = models.ImageField(upload_to='products/')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class GalleryImage(models.Model):
    product = models.ForeignKey(Product, related_name='gallery', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/gallery/')
    alt_text = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"Gallery for {self.product.name}"
