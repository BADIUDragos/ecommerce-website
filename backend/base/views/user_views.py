import os

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from django.template.loader import render_to_string
from django.utils.http import int_to_base36, base36_to_int
from django.utils.html import strip_tags
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMultiAlternatives
from email.mime.image import MIMEImage

from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

from base.serializers import UserSerializer, UserSerializerWithToken

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status

from django.conf import settings

from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data

        for k, v in serializer.items():
            data[k] = v

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def registerUser(request):
    data = request.data

    try:
        user = User.objects.create(
            first_name=data['name'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password'])
        )

        serializer = UserSerializerWithToken(user, many=False)

        # Send email to user with verification code

        return Response(serializer.data)
    except:
        message = {'detail': 'Email is already registerd'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def forgot_password(request):

    email = request.data.get('email')

    try:
        user = User.objects.get(email=email)
    except ObjectDoesNotExist:
        return Response({"detail": "No user associated with this email account was found."},
                        status=status.HTTP_400_BAD_REQUEST)

    token = default_token_generator.make_token(user)
    uid = int_to_base36(user.pk)

    reset_link = "http://localhost:3000/#/changepassword?uid=%s&token=%s" % (uid, token)

    context = {
        'user': user.username,
        'reset_link': reset_link,
    }

    email_subject = "Password Reset"
    email_html_body = render_to_string('PasswordResetEmail.html', context)
    email_text_body = strip_tags(email_html_body)

    email = EmailMultiAlternatives(
        email_subject,
        email_text_body,
        settings.EMAIL_HOST_USER,
        [user.email],
    )

    email.attach_alternative(email_html_body, "text/html")

    image_path = os.path.join(settings.BASE_DIR, 'static', 'images', 'logo_cut.png')
    with open(image_path, "rb") as f:
        logo_data = f.read()
    logo = MIMEImage(logo_data)
    logo.add_header('Content-ID', '<logo_cut>')
    logo.add_header('Content-Disposition', 'inline', filename="logo_cut.png")
    email.attach(logo)

    email.send(fail_silently=False)
    return Response({"detail": "Password reset email sent."}, status=status.HTTP_200_OK)


@api_view(['GET'])
def validate_token(request):

    uidb36 = request.query_params.get('uid')
    token = request.query_params.get('token')

    if request.method == 'GET':
        if uidb36 is None or token is None:
            return Response({"detail": "Missing token or UID."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uid = base36_to_int(uidb36)
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, OverflowError):
            return Response({"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)

        if default_token_generator.check_token(user, token):
            return Response({"detail": "Token is valid."}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Token is invalid or has expired."}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"detail": "Invalid request method."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['POST'])
def update_password(request):

    uidb36 = request.data.get('uid')
    token = request.data.get('token')

    if uidb36 is None or token is None:
        return Response({"detail": "Missing token or UID."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        uid = base36_to_int(uidb36)
        user = User.objects.get(pk=uid)
    except (User.DoesNotExist, ValueError, OverflowError):
        return Response({"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)

    if default_token_generator.check_token(user, token):
        new_password = request.data.get('password', None)
        if new_password:
            user.password = make_password(new_password)
            user.save()
            return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "New password is missing."}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"detail": "Token is invalid or has expired."}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user

    data = request.data
    user.first_name = data["name"]
    user.username = data["email"]

    email = data["email"]
    try:
        existing_user = User.objects.get(email=email)
        if existing_user != user:
            return Response({"detail": "A user with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)
    except ObjectDoesNotExist:
        pass

    user.email = email

    if data['password'] != "":
        user.password = make_password(data["password"])

    user.save()

    serializer = UserSerializerWithToken(user, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)

    return Response(serializer.data)


# Admin views

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserById(request, pk):
    user = User.objects.get(id=pk)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    userForDeletion = User.objects.get(id=pk)
    userForDeletion.delete()
    return Response('User was deleted')


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateUserProfileAdmin(request, pk):
    user = User.objects.get(id=pk)

    data = request.data

    user.first_name = data["name"]
    user.username = data["email"]
    user.email = data["email"]
    user.is_staff = data['isAdmin']

    user.save()

    serializer = UserSerializer(user, many=False)

    return Response(serializer.data)
