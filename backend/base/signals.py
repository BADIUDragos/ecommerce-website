from django.db.models.signals import pre_save
from django.contrib.auth.models import User
from django.dispatch import Signal
from django.core.mail import send_mail
from django.conf import settings
from base.models import Order


def updateUser(sender, instance, **kwargs):
    user = instance
    if user.email != '':
        user.username = user.email
    
pre_save.connect(updateUser, sender=User)

order_created = Signal()


def send_order_confirmation_email(sender, order, **kwargs):
    user = order.user
    order_items = order.orderitem_set.all()

    email_subject = 'Order Confirmation'
    email_body = f"Dear {user.first_name},\n\nThank you for your order! " \
                 f"Your order details are as follows:\n\nOrder ID: {order._id}\n\nItems:\n"
    for item in order_items:
        email_body += f"{item.name} (Quantity: {item.qty}, Price: ${item.price})\n"
    email_body += f"Subtotal: {order.itemsPrice}\n" \
                  f"Shipping: {order.shippingPrice}\n" \
                  f"Tax: {order.taxPrice}\n" \
                  f"Total: {order.totalPrice}\n"

    send_mail(
        email_subject,
        email_body,
        settings.EMAIL_HOST_USER,
        [user.email],
        fail_silently=False,
    )

order_created.connect(send_order_confirmation_email, sender=Order)
