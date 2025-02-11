from django.contrib import admin # type: ignore
from .models import User, Category, Product, Order, OrderItem
from cart.models import Cart, CartItem

# Register your models here.
admin.site.register(Category)
admin.site.register(User)
admin.site.register(Product)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Cart)
admin.site.register(CartItem)
