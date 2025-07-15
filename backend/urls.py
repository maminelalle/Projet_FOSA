# backend/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from fosa.views import FOSAViewSet

router = routers.DefaultRouter()
router.register(r'fosas', FOSAViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('fosa.urls')),
]
