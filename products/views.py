from django.views.generic import TemplateView
from django.conf import settings
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import redirect
import stripe
import json
from .models import Order

stripe.api_key = settings.STRIPE_SECRET_KEY

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

class SuccessView(TemplateView):
    template_name = "success.html"

class CancelView(TemplateView):
    template_name = "cancel.html"

@csrf_exempt
def create_checkout_session(request):
    if request.method == 'POST':
        try:
            # For this simple flow, we'll assume a single product or total amount from frontend
            # In a real app, you'd calculate this from the database
            data = json.loads(request.body)
            amount = int(float(data.get('amount', 99)) * 100) # Stripe expects fils (cents)
            product_name = data.get('product_name', 'Cea Luxury Scent')

            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[
                    {
                        'price_data': {
                            'currency': 'aed',
                            'product_data': {
                                'name': product_name,
                            },
                            'unit_amount': amount,
                        },
                        'quantity': 1,
                    },
                ],
                mode='payment',
                success_url=request.build_absolute_uri('/success/') + '?session_id={CHECKOUT_SESSION_ID}',
                cancel_url=request.build_absolute_uri('/cancel/'),
            )

            # Create order in pending status
            Order.objects.create(
                product_name=product_name,
                amount=amount / 100,
                stripe_session_id=checkout_session.id,
                payment_status='pending'
            )

            return JsonResponse({'url': checkout_session.url})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        return HttpResponse(status=400)

    # Handle the checkout.session.completed event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        # Fulfill the purchase...
        try:
            order = Order.objects.get(stripe_session_id=session.id)
            if order.payment_status != 'paid':
                order.payment_status = 'paid'
                # Optional: update amount if it changed or was missing
                order.amount = session.amount_total / 100
                order.save()
        except Order.DoesNotExist:
            # Fallback: create order if it didn't exist (e.g. session created outside this flow)
            Order.objects.create(
                product_name="Direct Payment",
                amount=session.amount_total / 100,
                stripe_session_id=session.id,
                payment_status='paid'
            )

    return HttpResponse(status=200)
