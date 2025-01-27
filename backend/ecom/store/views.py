from django.shortcuts import render # type: ignore

# Create your views here.
def home(request):
    return render(request, 'home.html', {})
