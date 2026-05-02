from django.contrib import admin
from .models import Product, GalleryImage, Order

class GalleryImageInline(admin.TabularInline):
    model = GalleryImage
    extra = 3

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'is_active', 'created_at')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [GalleryImageInline]

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'product_name', 'amount', 'currency', 'payment_status', 'created_at')
    list_filter = ('payment_status', 'created_at')
    search_fields = ('product_name', 'stripe_session_id')
    readonly_fields = ('stripe_session_id', 'created_at', 'updated_at')
