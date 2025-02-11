from django.db import models # type:ignore
import datetime
from django.contrib.auth.models import AbstractUser  # type:ignore
from django.utils.timezone import now



# Models

class User(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    def is_admin(self):
        return self.is_staff or self.is_superuser  # Admins and superusers

    def is_customer(self):
        return not self.is_admin()  # If not an admin, it's a customer

class Category(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = 'categories'



#ALL PRODUCTS
class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(default=0, decimal_places=2,max_digits=6)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, default=1)
    description = models.CharField(max_length=250, default='', blank=True, null=True)
    image = models.ImageField(upload_to='uploads/product/')
    #add sale stuff
    is_sale = models.BooleanField(default=False)
    sale_price = models.DecimalField(default=0, decimal_places=2,max_digits=6)
    def __str__(self):
        return f'{self.name}'

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    address = models.CharField(max_length=100, default="", blank=True)
    phone = models.CharField(max_length=20, default="", blank=True)
    email = models.EmailField(max_length=100, default="", blank=True)
    date = models.DateField(default=now)
    status = models.BooleanField(default=False)
    is_fulfilled = models.BooleanField(default=False)  # Can only be changed by superusers

    def __str__(self):
        return f'Order {self.id} by {self.user.username}'

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f'{self.quantity} x {self.product.name}'



