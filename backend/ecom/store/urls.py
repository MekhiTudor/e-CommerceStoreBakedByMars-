from django.urls import path # type: ignore
from . import views

urlpatterns = [
    path('',views.home, name = 'home'),
    path('api/products/', views.get_products, name='get_products'),
    #path('login/',views.login_user, name = 'login'),
    #path('logout',views.logout_user, name = 'logout')
]
