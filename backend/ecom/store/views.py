from django.shortcuts import get_object_or_404 # type: ignore
from django.http import JsonResponse # type: ignore
from .models import Product, User
from django.contrib.auth import authenticate, login, logout # type: ignore
from django.contrib import messages # type: ignore
import json
from django.contrib.auth.forms import UserCreationForm # type: ignore
from django import forms # type: ignore
from .forms import SignUpForm

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
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
#authentication!!
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return JsonResponse({"message": "Login successful", "user": user.username}, status=200)
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=400)

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