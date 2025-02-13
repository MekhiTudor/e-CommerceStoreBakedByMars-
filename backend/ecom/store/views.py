from django.shortcuts import get_object_or_404, render # type: ignore
import logging
import traceback
from django.http import JsonResponse , HttpResponse# type: ignore
from .models import Product, User, Order, OrderItem, Product
from cart.models import Cart
from django.conf import settings # type: ignore
from django.views.static import serve # type: ignore
import stripe # type: ignore
from django.contrib.auth import authenticate, login, logout # type: ignore
from django.contrib import messages # type: ignore
import json
import os
from django.contrib.auth.forms import UserCreationForm # type: ignore
from django import forms # type: ignore
from .forms import SignUpForm
from django.middleware.csrf import get_token # type: ignore
from django.views.decorators.csrf import csrf_exempt  # type: ignore
from django.views.decorators.csrf import ensure_csrf_cookie  # type: ignore
from rest_framework import status # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework.decorators import api_view, permission_classes # type: ignore
from rest_framework.permissions import IsAuthenticated # type: ignore
from django.contrib.auth.decorators import user_passes_test # type: ignore
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



@api_view(["POST"])
def login_user(request):
    """
    Authenticates the user.
    Expects a JSON payload with 'username' and 'password'.
    On success, logs in the user and returns a success message.
    """
    try:
        print("Received login request")
        print(f"Request body: {request.body}")

        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            print("Missing username or password")
            return JsonResponse({"error": "Username and password are required"}, status=400)

        print(f"Attempting authentication for username: {username}")

        user = authenticate(request, username=username, password=password)

        if user is not None:
            print(f"Authentication successful for user: {user.username}")
            login(request, user)

            # Debugging session information
            session_id = request.session.session_key
            if not session_id:
                request.session.save()  # Ensure the session is saved
                session_id = request.session.session_key
            print(f"Session ID after login: {session_id}")

            return JsonResponse({"message": "Login successful", "user": user.username}, status=200)
        else:
            print("Authentication failed: Invalid credentials")
            return JsonResponse({"error": "Invalid credentials"}, status=400)

    except json.JSONDecodeError:
        print("Error: Invalid JSON payload")
        return JsonResponse({"error": "Invalid JSON format"}, status=400)

    except Exception as e:
        print("Unexpected error during login:", e)
        return JsonResponse({"error": "Server error"}, status=500)

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
@permission_classes([IsAuthenticated])
def create_order(request):
    """
    Creates a new order for the authenticated user.
    Expects a JSON payload with:
      - "items": a list of objects, each with 'product_id' and 'quantity'
      - Optional order details: 'address', 'phone', 'email'
    """
    user = request.user
    data = request.data

    # Validate that items are provided
    if "items" not in data or not data["items"]:
        return Response({"error": "No items in the order"}, status=status.HTTP_400_BAD_REQUEST)

    # Create the Order instance for the user
    order = Order.objects.create(
        user=user,
        address=data.get("address", ""),
        phone=data.get("phone", ""),
        email=data.get("email", ""),
    )

    # Add each item to the order
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


def check_auth(request):
    if request.user.is_authenticated:
        return JsonResponse({"authenticated": True, "user": request.user.username})
    return JsonResponse({"authenticated": False})



def serve_react_app(request, path=""):
    """
    Serves React's index.html for unknown routes.
    """
    frontend_path = os.path.join(settings.FRONTEND_DIR, "index.html")

    if not os.path.exists(frontend_path):
        return HttpResponse("React build not found", status=404)

    with open(frontend_path, "r", encoding="utf-8") as file:
        return HttpResponse(file.read())

def serve_static_files(request, path):
    """
    Serve JavaScript, CSS, and other static assets properly.
    """
    file_path = os.path.join(settings.FRONTEND_DIR, "assets", path)

    if os.path.exists(file_path):
        return serve(request, path, document_root=os.path.join(settings.FRONTEND_DIR, "assets"))

    return HttpResponse("File not found", status=404)


logger = logging.getLogger(__name__)

stripe.api_key = settings.STRIPE_SECRET_KEY

@api_view(["POST"])
@permission_classes([IsAuthenticated])
@csrf_exempt  # Stripe needs to communicate with your server, so no CSRF protection
def create_checkout_session(request):
    user = request.user
    logger.info(f"Starting checkout session for user: {user}")

    try:
        # Log the incoming request data
        logger.info(f"Request data: {request.data}")

        # Get the cart items from request
        cart_items = request.data.get("items", [])
        if not cart_items:
            logger.error("No cart items provided in request!")
            return JsonResponse({"error": "No cart items provided"}, status=400)

        line_items = []
        for item in cart_items:
            try:
                product = Product.objects.get(id=item["product_id"])
                logger.info(f"Adding product {product.name} to checkout session.")
                
                line_items.append({
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {'name': product.name},
                        'unit_amount': int(product.price * 100),  # Convert price to cents
                    },
                    'quantity': item["quantity"],
                })
            except Product.DoesNotExist:
                logger.error(f"Product with ID {item['product_id']} not found!")
                return JsonResponse({"error": f"Product with ID {item['product_id']} not found"}, status=400)
            except Exception as e:
                logger.error(f"Error fetching product: {str(e)}")
                return JsonResponse({"error": f"Error fetching product: {str(e)}"}, status=500)

        logger.info(f"Final line items for checkout: {line_items}")

        # Create Stripe checkout session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            success_url="http://localhost:3000/success",
            cancel_url="http://localhost:3000/cancel",
        )

        logger.info(f"Checkout session created successfully: {checkout_session.id}")
        return JsonResponse({"id": checkout_session.id})

    except stripe.error.StripeError as se:
        logger.error(f"Stripe error: {str(se)}")
        traceback.print_exc()
        return JsonResponse({"error": f"Stripe error: {str(se)}"}, status=500)

    except Exception as e:
        logger.error(f"General error: {str(e)}")
        traceback.print_exc()
        return JsonResponse({"error": f"Internal server error: {str(e)}"}, status=500)