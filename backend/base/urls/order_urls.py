from django.urls import path
from base.views import order_views as views

urlpatterns = [
    path('', views.getOrders, name='orders'),

    path('add/', views.addOrderItems, name='orders-add'),
    path('myorders/', views.getMyOrders, name='my-orders'),
    path('total/', views.getPrices, name='get-prices'),
    path('stripe/', views.get_stripe_info, name='get-stripe-info'),
    path('payment-intent/', views.create_payment_intent, name='create-payment-intent'),

    path('<str:pk>/', views.getOrderById, name='user-order'),
    path('<str:pk>/shipped/', views.updateOrderToShipped, name='shipped-order'),
    path('<str:pk>/delivered/', views.updateOrderToDelivered, name='delivered-order'),
]
