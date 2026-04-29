from django.shortcuts import render
from django.views.generic import TemplateView

class HomeView(TemplateView):
    template_name = "index.html"

class CollectionView(TemplateView):
    template_name = "products.html"

class StoryView(TemplateView):
    template_name = "story.html"

class SustainabilityView(TemplateView):
    template_name = "sustainability.html"

class ContactView(TemplateView):
    template_name = "contact.html"

class ProductDetailView(TemplateView):
    template_name = "product-detail.html"

class CheckoutView(TemplateView):
    template_name = "checkout.html"
