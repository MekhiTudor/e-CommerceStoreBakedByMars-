from django.shortcuts import render # type: ignore
from django.http import JsonResponse # type: ignore
from .models import Product

# Create your views here.
def home(request):
    products = Product.objects.all()
    return render(request, 'home.html', {'products': products})


def get_products(request):
    products = Product.objects.all().values(
        'id', 'name', 'price', 'category__name', 'description', 'image', 'is_sale', 'sale_price'
    )
    return JsonResponse(list(products), safe=False)
