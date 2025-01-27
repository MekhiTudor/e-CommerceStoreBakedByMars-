from django.contrib import admin
from django.urls import path, includes

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', includes(store.urls))
]
