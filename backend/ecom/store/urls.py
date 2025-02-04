from django.urls import path # type: ignore
from . import views

urlpatterns = [
    path('api/get_products/', views.get_products, name='get_products'),
    path('api/get_product/', views.get_product, name='get_product'),
    path('api/login/',views.login_user, name = 'login'),
    path('api/logout/',views.logout_user, name = 'logout'),
    path('api/register/',views.register_user, name = 'register')
]
