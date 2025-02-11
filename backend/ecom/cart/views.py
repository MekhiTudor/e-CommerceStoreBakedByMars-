from rest_framework.decorators import api_view, permission_classes 
from rest_framework.response import Response  
from rest_framework.permissions import IsAuthenticated  
from .models import Cart, CartItem
from store.models import Product
from django.shortcuts import get_object_or_404  # type: ignore
from django.http import JsonResponse  # type: ignore
from .serializers import CartSerializer  # type: ignore

# This view retrieves the cart for the logged-in user.
@api_view(["GET"])
@permission_classes([IsAuthenticated])  # Only logged-in users can access their cart
def get_cart(request):
    # Get or create the cart for the logged-in user
    cart, created = Cart.objects.get_or_create(user=request.user)
    serializer = CartSerializer(cart)
    return JsonResponse(serializer.data, safe=False)

# This view adds one or more items to the logged-in user's cart.
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    """
    Expects a JSON payload with either:
      - A dict: { "id": <product_id>, "quantity": <quantity> } or
      - A list of such dicts.
    """
    # Retrieve or create the cart for the logged-in user
    cart, created = Cart.objects.get_or_create(user=request.user)
    print(f"User cart: {cart.id} (created: {created})")
    
    # Get the incoming data from the request body
    items = request.data
    if not items:
        return JsonResponse({"error": "No items provided"}, status=400)

    # If a single dict is provided, convert it to a list for uniform processing
    if isinstance(items, dict):
        items = [items]

    # Process each item provided in the payload
    for item in items:
        product_id = item.get("id")
        quantity = item.get("quantity", 1)
        if not product_id:
            continue  # Optionally handle the error for missing product id

        # Retrieve the product or return a 404 error if not found
        product = get_object_or_404(Product, id=product_id)

        # Get or create a CartItem for the given product in the user's cart
        cart_item, item_created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={"quantity": quantity}
        )
        if not item_created:
            # If the item already exists, simply increment its quantity
            cart_item.quantity += quantity
            cart_item.save()

    return JsonResponse({"message": "Item(s) added to cart successfully"})

# This view updates the quantity of a specific cart item.
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_cart_item(request, item_id):
    """
    Update the quantity of an item in the logged-in user's cart.
    If the new quantity is zero or less, the item is removed.
    """
    # Ensure that the cart item belongs to the logged-in user
    item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
    quantity = int(request.data.get("quantity", 1))
    if quantity > 0:
        item.quantity = quantity
        item.save()
        return Response({"message": "Cart item updated", "quantity": item.quantity})
    else:
        item.delete()
        return JsonResponse({"message": "Cart item removed"})

# This view removes a specific item from the logged-in user's cart.
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, item_id):
    # Ensure that the item to remove belongs to the logged-in user
    item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
    item.delete()
    return JsonResponse({"message": "Item removed from cart"})