# cart/urls.py

from django.urls import path
from .views import get_cart, add_to_cart, update_cart_item, remove_from_cart

urlpatterns = [
    path("api/cart/", get_cart, name="get-cart"),
    path("api/cart/add/", add_to_cart, name="add-to-cart"),
    path("api/cart/update/<int:item_id>/", update_cart_item, name="update-cart-item"),
    path("api/cart/remove/<int:item_id>/", remove_from_cart, name="remove-from-cart"),
]
