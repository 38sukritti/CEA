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

class Order(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
    ]

    # Professional Order ID (e.g., #CEA-X9K2-77)
    order_number = models.CharField(max_length=20, unique=True, blank=True, null=True)

    # Customer Info
    first_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    
    # Shipping Info
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    emirate = models.CharField(max_length=100, blank=True, null=True)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    product_name = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2) # Subtotal
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00) # Subtotal + Shipping
    currency = models.CharField(max_length=10, default='AED')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    stripe_session_id = models.CharField(max_length=255, unique=True)
    # Tracking Info
    SHIPPING_STATUS_CHOICES = [
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    shipping_status = models.CharField(max_length=20, choices=SHIPPING_STATUS_CHOICES, default='processing')
    tracking_number = models.CharField(max_length=100, blank=True, null=True)
    tracking_url = models.URLField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.order_number:
            import random
            import string
            chars = string.ascii_uppercase + string.digits
            # Format: CEA-XXXX (e.g. CEA-K9L2)
            code = ''.join(random.choices(chars, k=5))
            self.order_number = f"CEA-{code}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f'Order {self.order_number} - {self.first_name} {self.last_name} ({self.payment_status})'

