import decimal

import stripe
from stripe.error import StripeError

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from datetime import datetime

from base.models import Product, Order, OrderItem, ShippingAddress
from base.serializers import OrderSerializer, BillSerializer, StripeSerializer, StripePaymentIntentResponseSerializer, \
    StripePaymentIntentSerializer

from base.signals import order_created, order_shipped, order_delivered


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data
    orderItems = data['orderItems']

    if len(orderItems) == 0:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
    else:

        order = Order.objects.create(
            user=user,
            itemsPrice=data['itemsPrice'],
            taxPrice=data['taxPrice'],
            shippingPrice=data['shippingPrice'],
            totalPrice=data['totalPrice'],
            isPaid=True,
            paidAt=datetime.now()
        )
    
        shipping = ShippingAddress.objects.create(
            order=order,
            address=data['shippingAddress']['address'],
            city=data['shippingAddress']['city'],
            postalCode=data['shippingAddress']['postalCode'],
            country='Canada'
        )

        for i in orderItems:
            product = Product.objects.get(_id=i['product'])

            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=i['qty'],
                price=i['price'],
                image=product.image.url
            )

            product.countInStock -= int(item.qty)
            product.save()

            order_created.send(sender=Order, order=order)

        serializer = OrderSerializer(order, many=False)

        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):

    try:
        user = request.user
        order = Order.objects.get(_id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many = False)
            return Response(serializer.data)
        else: 
            return Response({'detail': 'Not authorized to view this order'}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_400_BAD_REQUEST)


# Admin views

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToShipped(request, pk):
    order = Order.objects.get(_id = pk)

    order.isShipped = True
    order.shippedAt = datetime.now()
    order.save()

    order_shipped.send(sender=Order, order=order)

    return Response('Order was delivered')


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    order = Order.objects.get(_id = pk)

    order.isShipped = True
    order.shippedAt = datetime.now()
    order.isDelivered = True
    order.deliveredAt = datetime.now()
    order.save()

    order_delivered.send(sender=Order, order=order)

    return Response('Order was delivered')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def getPrices(request):

    subtotal = 0

    items = request.data
    if not items:
        return Response({'detail': 'No Items in Request'}, status=status.HTTP_400_BAD_REQUEST)

    for item in items:
        product = Product.objects.get(_id=item['id'])
        qty = item['qty']
        if product.countInStock < qty:
            return Response({'detail': 'Only %d %s are currently left in stock' % (product.countInStock, product.name)},
                            status=status.HTTP_400_BAD_REQUEST)
        price = product.price * qty
        subtotal += price

    shipping = 0
    if subtotal < 100.00:
        shipping = 10
    tax_rate = decimal.Decimal('0.14975')
    tax = (subtotal+shipping) * tax_rate

    total = subtotal + tax

    serializer = BillSerializer({'subtotal': subtotal, 'tax': tax, 'shipping': shipping, 'total': total})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_stripe_info(request):

    stripe_public = "pk_test_51MvqTOJMCbcrYDEx1I6IVgjw0Bfdu349ua1j2gA3vn3rErY1AYwSc7Pqdq7yVnlwbVhbZPEGlNherPKcEJW4JSvF00m1O9F2vT"

    serializer = StripeSerializer({'stripe_public': stripe_public})
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_intent(request):
    serializer = StripePaymentIntentSerializer(data=request.data)
    if serializer.is_valid():
        amount = int(serializer.validated_data['amount'] * 100)
        currency = serializer.validated_data['currency']
        description = serializer.validated_data['description']

        try:
            payment_intent = stripe.PaymentIntent.create(
                amount=amount,
                currency=currency,
                description=description,
            )
            response_serializer = StripePaymentIntentResponseSerializer(payment_intent)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        except StripeError as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
