from django.views.generic import TemplateView
from django.conf import settings
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import redirect
import stripe
import json
from .models import Order
from .email_utils import send_order_confirmation_email

stripe.api_key = settings.STRIPE_SECRET_KEY

SHIPPING_RATES = {
    'Dubai': 0,
    'Abu Dhabi': 30,
    'Sharjah': 0,
    'Ajman': 0,
    'Umm Al Quwain': 0,
    'Ras Al Khaimah': 0,
    'Fujairah': 30,
}

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
            data = json.loads(request.body)
            amount = float(data.get('amount', 99)) # Subtotal
            product_name = data.get('product_name', 'Cea Luxury Scent')
            
            # Customer Data
            first_name = data.get('first_name', '')
            last_name = data.get('last_name', '')
            email = data.get('email', '')
            phone = data.get('phone', '')
            address = data.get('address', '')
            city = data.get('city', '')
            emirate = data.get('emirate', 'Dubai')

            # Validate mandatory fields
            if not all([first_name, last_name, email, phone, address, city, emirate]):
                return JsonResponse({'error': 'All shipping and contact fields are mandatory.'}, status=400)

            # Calculate Shipping
            shipping_cost = SHIPPING_RATES.get(emirate, 30)
            total_amount_aed = amount + shipping_cost
            
            # Stripe expects unit_amount in fils (cents)
            stripe_total_amount = int(total_amount_aed * 100)

            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                customer_email=email,
                line_items=[
                    {
                        'price_data': {
                            'currency': 'aed',
                            'product_data': {
                                'name': product_name,
                                'description': f"Shipping to {emirate}"
                            },
                            'unit_amount': stripe_total_amount,
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
                first_name=first_name,
                last_name=last_name,
                email=email,
                phone=phone,
                address=address,
                city=city,
                emirate=emirate,
                product_name=product_name,
                amount=amount,
                shipping_cost=shipping_cost,
                total_amount=total_amount_aed,
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
                
                # Send Confirmation Emails
                try:
                    send_order_confirmation_email(order)
                except Exception as e:
                    print(f"Error sending email: {e}")
                    
        except Order.DoesNotExist:
            # Fallback: create order if it didn't exist (e.g. session created outside this flow)
            Order.objects.create(
                product_name="Direct Payment",
                amount=session.amount_total / 100,
                total_amount=session.amount_total / 100,
                stripe_session_id=session.id,
                payment_status='paid'
            )

    return HttpResponse(status=200)
