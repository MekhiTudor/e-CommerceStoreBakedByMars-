from django.shortcuts import get_object_or_404 # type: ignore
from django.http import JsonResponse # type: ignore
from .models import Product, User, Order, OrderItem, Product
from django.contrib.auth import authenticate, login, logout # type: ignore
from django.contrib import messages # type: ignore
import json
from django.contrib.auth.forms import UserCreationForm # type: ignore
from django import forms # type: ignore
from .forms import SignUpForm
from django.middleware.csrf import get_token # type: ignore
from django.views.decorators.csrf import csrf_exempt  # type: ignore
from django.views.decorators.csrf import ensure_csrf_cookie  # type: ignore
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.decorators import user_passes_test
from .serializers import OrderSerializer

# Create your views here.

def get_product(request, product_id):
    #Returns a JSON response with a single product
    product = get_object_or_404(Product, id=product_id)
    
    product_data = {
        'id': product.id,
        'name': product.name,
        'price': product.price,
        'category': product.category.name if product.category else None,
        'description': product.description,
        'image': product.image.url if product.image else None,
        'is_sale': product.is_sale,
        'sale_price': product.sale_price
    }
    
    return JsonResponse(product_data, safe=False)


def get_products(request):
    #returns a JSON response with all products
    products = Product.objects.all().values(
        'id', 'name', 'price', 'category__name', 'description', 'image', 'is_sale', 'sale_price'
    )
    return JsonResponse(list(products), safe=False)



def login_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")

            print("Received data:", data)  # Debugging

            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({"message": "Login successful", "user": user.username}, status=200)
            else:
                return JsonResponse({"error": "Invalid credentials"}, status=400)
        except Exception as e:
            print("Error:", str(e))  # Print error message
            return JsonResponse({"error": "Server error"}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)

def logout_user(request):
    logout(request)
    return JsonResponse({"message": "Logged out successfully"}, status=200)


def register_user(request):
    #Handles user registration
    if request.method == "POST":
        data = json.loads(request.body)
        form = SignUpForm(data)
        if form.is_valid():
            user = form.save()
            return JsonResponse({"message": "User registered successfully", "user": user.username}, status=201)
        return JsonResponse({"error": form.errors}, status=400)



@ensure_csrf_cookie
def get_csrf_token(request):
    token = get_token(request)
    response = JsonResponse({"csrfToken": token})
    response["Access-Control-Allow-Credentials"] = "true"  # Allow cookies
    return response



@api_view(["POST"])
@permission_classes([IsAuthenticated])  # Ensure only logged-in users can place orders
def create_order(request):
    """
    Creates a new order for the authenticated user.
    Expects a JSON payload with 'items': [{ 'product_id': X, 'quantity': Y }]
    """
    user = request.user
    data = request.data

    # Validate required fields
    if "items" not in data or not data["items"]:
        return Response({"error": "No items in the order"}, status=status.HTTP_400_BAD_REQUEST)

    # Create the Order
    order = Order.objects.create(
        user=user,
        address=data.get("address", ""),
        phone=data.get("phone", ""),
        email=data.get("email", ""),
    )

    # Add items to the order
    for item in data["items"]:
        try:
            product = Product.objects.get(id=item["product_id"])
            quantity = item.get("quantity", 1)
            OrderItem.objects.create(order=order, product=product, quantity=quantity)
        except Product.DoesNotExist:
            return Response({"error": f"Product ID {item['product_id']} not found"}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"message": "Order created successfully", "order_id": order.id}, status=status.HTTP_201_CREATED)

# View to update order fulfillment (only for superusers)
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
@user_passes_test(lambda u: u.is_superuser)
def update_order_fulfillment(request, order_id):
    """
    Allows superusers to update the 'is_fulfilled' status of an order.
    """
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

    order.is_fulfilled = request.data.get("is_fulfilled", order.is_fulfilled)
    order.save()

    return Response({"message": f"Order {order_id} fulfillment updated"}, status=status.HTTP_200_OK)
