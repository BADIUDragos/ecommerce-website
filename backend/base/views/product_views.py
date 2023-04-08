from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from base.models import Product, Review
from base.serializers import ProductSerializer


from rest_framework import status

@api_view(['GET'])
def getTopProducts(request):
    products = Product.objects.filter(rating__gt=2).order_by('-rating')[0:5]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getProducts(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

# Authentificated views

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    product = Product.objects.get(_id=pk)
    data = request.data

    # User already left a review on this product
    already_exists = product.review_set.filter(user=user).exists()

    if already_exists:
        content = {'detail':"You've already reviewed this product"}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # No rating ?

    elif data['rating'] == 0:
        content = {'detail': "Please select a rating"}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # Create review
    else:
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment']
        )

        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        total = 0
        for review in reviews:
            total += review.rating
        product.rating = total / len(reviews)
        product.save()

        return Response({'detail': 'Review was created'})


# Admin views

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    productForDeletion = Product.objects.get(_id=pk)
    productForDeletion.delete()
    return Response('Product was deleted')

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):

    user = request.user
    product = Product.objects.create(
       user = user,
        name='Product Name',
        price=0,
        brand='Annedora',
        countInStock=0,
        category='Honey Products',
        description='' 
    )

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    product = Product.objects.get(_id=pk) 
    data = request.data

    product.name = data["name"]
    product.price = data["price"]
    product.brand = data["brand"]
    product.countInStock = data['countInStock']
    product.category = data['category']
    product.description = data['description']

    product.save()

    serializer = ProductSerializer(product, many=False)

    return Response(serializer.data)

@api_view(['POST'])
def uploadImage(request):
    data = request.data

    product_id = data['product_id']
    product = Product.objects.get(_id=product_id)

    product.image = request.FILES.get('image')
    product.save()
    return Response('Image was uploaded')