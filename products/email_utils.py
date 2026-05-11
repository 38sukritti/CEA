from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

def send_order_confirmation_email(order):
    """
    Sends order confirmation email to the customer and the admin.
    """
    subject = f'Order Confirmation - {order.product_name} | Cea.'
    from_email = settings.DEFAULT_FROM_EMAIL or 'noreply@cea.ae'
    to_customer = order.email
    to_admin = settings.ADMIN_EMAIL

    context = {
        'order': order,
        'admin_email': to_admin
    }

    # Render HTML content
    html_content = render_to_string('emails/order_confirmation.html', context)
    text_content = strip_tags(html_content)

    # Send to Customer
    msg_customer = EmailMultiAlternatives(subject, text_content, from_email, [to_customer])
    msg_customer.attach_alternative(html_content, "text/html")
    msg_customer.send()

    # Send to Admin (with slightly different subject)
    admin_subject = f'New Order Received - Order #{order.id}'
    msg_admin = EmailMultiAlternatives(admin_subject, text_content, from_email, [to_admin])
    msg_admin.attach_alternative(html_content, "text/html")
    msg_admin.send()
