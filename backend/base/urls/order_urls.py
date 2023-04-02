from django.urls import path
from base.views import order_views as views

urlpatterns = [
    path('', views.getOrders, name='orders'),

    path('add/', views.addOrderItems, name='orders-add'),
    path('myorders/', views.getMyOrders, name='my-orders'),
    path('total/', views.getPrices, name='get-prices'),
    path('paypal/', views.getPayPalInfo, name='get-paypal-info'),

    path('<str:pk>/', views.getOrderById, name='user-order'),
    path('<str:pk>/pay/', views.updateOrderToPaid, name='pay'),
    path('<str:pk>/shipped/', views.updateOrderToShipped, name='shipped-order'),
    path('<str:pk>/delivered/', views.updateOrderToDelivered, name='delivered-order'),
]