from django.test import TestCase
from django.core import mail
from base.models import Order, User, Product, OrderItem, ShippingAddress
from base.signals import order_created

from django.test import override_settings


class OrderConfirmationEmailSendSignalTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword'
        )

        self.product = Product.objects.create(
            name='Test Product',
            price=10.0,
            countInStock=100,
            description='Test product description'
        )

    @override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
    def test_email_sent_on_order_created(self):
        order = Order.objects.create(
            user=self.user,
            paymentMethod='Test Payment Method',
            itemsPrice=10.0,
            taxPrice=1.0,
            shippingPrice=5.0,
            totalPrice=16.0,
            isPaid=True
        )

        ShippingAddress.objects.create(
            order=order,
            address='Test Street',
            city='Test City',
            postalCode='12345',
            country='Test Country'
        )

        OrderItem.objects.create(
            product=self.product,
            order=order,
            name=self.product.name,
            qty=1,
            price=self.product.price,
            image=self.product.image.url
        )

        order_created.send(sender=Order, order=order)

        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Order Confirmation')
        self.assertIn('Test Product', mail.outbox[0].body)
