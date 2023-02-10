from django.urls import path
from base.views import user_views as views

urlpatterns = [
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),

    path('', views.getUsers, name='users'),
    path('profile/', views.getUserProfile, name='users-profile'),
    path('profile/update/', views.updateUserProfile, name='users-profile-update'),
    path('register/', views.registerUser, name='register'),

    path('<str:pk>', views.getUserById, name='user'),
    path('update/<str:pk>', views.updateUserProfile, name='user-update'),
    path('delete/<str:pk>', views.deleteUser, name='user-delete'),
]
