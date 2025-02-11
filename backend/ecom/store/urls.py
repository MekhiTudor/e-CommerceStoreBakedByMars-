# store/urls.py

from django.urls import path, include
from . import views
from .views import get_csrf_token, login_user, create_order, update_order_fulfillment, check_auth


urlpatterns = [
    path('api/get_products/', views.get_products, name='get_products'),
    path('api/get_product/', views.get_product, name='get_product'),
    path('api/login/', login_user, name='login'),
    path('api/logout/', views.logout_user, name='logout'),
    path('api/register/', views.register_user, name='register'),
    path("api/csrf/", get_csrf_token, name="csrf"),
    path("orders/create/", create_order, name="create-order"),
    path("orders/<int:order_id>/fulfill/", update_order_fulfillment, name="update-order-fulfillment"),
    path("api/check-auth/", check_auth, name="check-auth"),
     path('api-auth/', include('rest_framework.urls')),
]
