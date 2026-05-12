from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

def send_order_confirmation_email(order):
    """
    Sends premium order confirmation emails.
    Customer: Payment Successful Receipt
    Admin: New Order Notification
    """
    from_email = settings.DEFAULT_FROM_EMAIL or 'noreply@cea.ae'
    to_admin = settings.ADMIN_EMAIL

    # 1. Send to Customer
    customer_subject = f'Payment Successful - Order #{order.order_number} | Cea.'
    customer_html = render_to_string('emails/customer_confirmation.html', {
        'order': order,
        'admin_email': to_admin
    })
    customer_text = strip_tags(customer_html)
    
    msg_customer = EmailMultiAlternatives(customer_subject, customer_text, from_email, [order.email])
    msg_customer.attach_alternative(customer_html, "text/html")
    msg_customer.send()

    # 2. Send to Admin
    admin_subject = f'New Order Received - {order.order_number}'
    admin_html = render_to_string('emails/admin_notification.html', {
        'order': order
    })
    admin_text = strip_tags(admin_html)
    
    msg_admin = EmailMultiAlternatives(admin_subject, admin_text, from_email, [to_admin])
    msg_admin.attach_alternative(admin_html, "text/html")
    msg_admin.send()
