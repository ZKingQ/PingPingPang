"""finalProject_canavsGame URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import os
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

from finalProject_canavsGame import settings
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('ai/', views.AI)
]

if settings.DEBUG:
    media_root = os.path.join(settings.BASE_DIR, 'templates')
    urlpatterns += static('/', document_root=media_root)
