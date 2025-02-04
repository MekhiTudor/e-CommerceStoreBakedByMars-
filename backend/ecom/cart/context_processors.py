from .cart import Cart

#cart processor so it works on all pages
def cart(request):
    #return default data from cart
    return {'cart': Cart(request)}