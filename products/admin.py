from django.contrib import admin
from .models import Product, GalleryImage

class GalleryImageInline(admin.TabularInline):
    model = GalleryImage
    extra = 3

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'is_active', 'created_at')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [GalleryImageInline]
