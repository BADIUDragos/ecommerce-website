from django.urls import path
from . import views

urlpatterns = [
    path('users/login/', views.TokenObtainPairView.as_view(), name='token_obtain_pair'),

    path('users/', views.getUsers, name='users'),
    path('users/profile/', views.getUserProfile, name='users-profile'),
    path('users/register/', views.registerUser, name='register'),

    path('products/', views.getProducts, name='products'),
    path('products/<str:pk>', views.getProduct, name='product'),
]
