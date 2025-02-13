from rest_framework import serializers # type: ignore
from .models import Cart, CartItem

class CartItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    product_id = serializers.IntegerField(source="product.id")  
    product_name = serializers.CharField(source="product.name")
    product_price = serializers.DecimalField(source="product.price", max_digits=6, decimal_places=2)

    class Meta:
        model = CartItem
        fields = ["id","product_id", "product_name", "product_price", "quantity"]  


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "user", "items"]

