from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from products.views import (
    HomeView, CollectionView, StoryView, 
    SustainabilityView, ContactView, ProductDetailView, CheckoutView,
    SuccessView, CancelView, create_checkout_session, stripe_webhook
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Page Routes
    path('', HomeView.as_view(), name='home'),
    path('index.html', HomeView.as_view()),
    
    path('products.html', CollectionView.as_view(), name='collection'),
    path('collection/', CollectionView.as_view()),
    
    path('story.html', StoryView.as_view(), name='story'),
    path('story/', StoryView.as_view()),
    
    path('sustainability.html', SustainabilityView.as_view(), name='sustainability'),
    path('sustainability/', SustainabilityView.as_view()),
    
    path('contact.html', ContactView.as_view(), name='contact'),
    path('contact/', ContactView.as_view()),
    
    path('product-detail.html', ProductDetailView.as_view(), name='product_detail'),
    
    path('checkout.html', CheckoutView.as_view(), name='checkout'),
    path('checkout/', CheckoutView.as_view()),
    
    # Stripe Routes
    path('create-checkout-session/', create_checkout_session, name='create_checkout_session'),
    path('success/', SuccessView.as_view(), name='payment_success'),
    path('cancel/', CancelView.as_view(), name='payment_cancel'),
    path('webhook/stripe/', stripe_webhook, name='stripe_webhook'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static('/assets/', document_root=settings.BASE_DIR / 'dist' / 'assets')
    urlpatterns += static('/images/', document_root=settings.BASE_DIR / 'public' / 'images')
    urlpatterns += static('/public/', document_root=settings.BASE_DIR / 'public')
    urlpatterns += static('/src/', document_root=settings.BASE_DIR / 'src')
