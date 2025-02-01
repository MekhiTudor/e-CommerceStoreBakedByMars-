from django.shortcuts import render, redirect # type: ignore
from django.http import JsonResponse # type: ignore
from .models import Product, User
from django.contrib.auth import authenticate, login, logout # type: ignore
from django.contrib import messages # type: ignore

from django.contrib.auth.forms import UserCreationForm # type: ignore
from django import forms # type: ignore
from .forms import SignUpForm

# Create your views here.
def home(request):
    products = Product.objects.all()
    return render(request, 'home.html', {'products': products})


def get_products(request):
    products = Product.objects.all().values(
        'id', 'name', 'price', 'category__name', 'description', 'image', 'is_sale', 'sale_price'
    )
    return JsonResponse(list(products), safe=False)


def login_user(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            messages.success(request, "You have been logged in!")
            return redirect('home')
        else:
            messages.error(request, "There was an error logging you in. Please check your credentials.")
            return redirect('login')

    return render(request, 'login.html', {})


def logout_user(request):
    logout(request)
    messages.success(request, "You have been logged out.")
    return redirect('home')


def register_user(request):
    if request.method == "POST":
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)  # Save the form but don't commit yet
            user.phone_number = form.cleaned_data.get("phone_number")  # Get phone number from form
            user.save()  # Save user with extra fields

            # Authenticate and login the user
            raw_password = form.cleaned_data.get("password1")
            user = authenticate(username=user.username, password=raw_password)
            
            if user is not None:
                login(request, user)
                messages.success(request, "You have successfully registered and logged in!")
                return redirect('home')
        else:
            messages.error(request, "There was a problem with your registration. Please try again.")
            print(form.errors)
    else:
        form = SignUpForm()
    
    return render(request, 'register.html', {"form": form})