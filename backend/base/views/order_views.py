import decimal

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from datetime import datetime

from base.models import Product, Order, OrderItem, ShippingAddress
from base.serializers import OrderSerializer, BillSerializer, PayPalSerializer


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
            user = user,
            paymentMethod = data['paymentMethod'],
            itemsPrice = data['itemsPrice'],
            taxPrice = data['taxPrice'],
            shippingPrice = data['shippingPrice'],
            totalPrice = data['totalPrice']
        )
    
        shipping = ShippingAddress.objects.create(
            order = order,
            address = data['shippingAddress']['address'],
            city = data['shippingAddress']['city'],
            postalCode = data['shippingAddress']['postalCode'],
            country = 'Canada'
        )

        for i in orderItems:
            product = Product.objects.get(_id=i['product'])

            item = OrderItem.objects.create(
                product = product,
                order = order,
                name = product.name,
                qty = i['qty'],
                price = i['price'],
                image = product.image.url,
            )

            product.countInStock -= int(item.qty)
            product.save()

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


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    order = Order.objects.get(_id = pk)

    order.isPaid = True
    order.paidAt = datetime.now()
    order.save()

    return Response('Order was paid')

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
def getPayPalInfo(request):

    client_id = "AQePZy-SSCXcibd6BMmMP-ps5m1w_4xaQISOPBjcOfmOZ1UuHebHJaCKhUbvfm9AWM-BdzgdHIVjpkAY"
    currency = "CAD"

    serializer = PayPalSerializer({'client_id': client_id, 'currency': currency})
    return Response(serializer.data)
