from django.contrib import admin # type: ignore
from django.urls import path, include, re_path# type: ignore
from store.views import serve_react_app, serve_static_files
from . import settings
from django.conf.urls.static import static # type: ignore

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('store.urls')),
    path('', include('cart.urls')),

    # Serve media files before React routes
] 

# Serve media files
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Serve JavaScript, CSS, and assets
urlpatterns += [ 
    re_path(r"^assets/(?P<path>.*)$", serve_static_files),
]

# Serve React frontend for all other routes
urlpatterns += [
    re_path(r"^.*$", serve_react_app),
]