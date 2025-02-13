from django.conf import settings  # type: ignore
from django.db import models # type: ignore
from store.models import Product  # Adjust import based on your project structure

# Updated Cart model:
# - We now require that the user is logged in.
# - Using OneToOneField ensures that each user has a single, unique cart.
class Cart(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart for {self.user.username}"

# CartItem model remains the same:
class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name="items"  # Use this name to access all items in a cart
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} (Cart ID: {self.cart.id})"