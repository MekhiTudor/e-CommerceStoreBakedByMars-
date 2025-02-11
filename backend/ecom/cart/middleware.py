
from django.utils.deprecation import MiddlewareMixin
from cart.models import Cart

class CartMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if not request.user.is_authenticated:
            if "cart_id" not in request.session:
                cart = Cart.objects.create()
                request.session["cart_id"] = cart.id
        else:
            if "cart_id" in request.session:
                del request.session["cart_id"]  # Clear guest cart on login
