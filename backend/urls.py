from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from fosa.views import FOSAViewSet, FOSAHistoryViewSet

router = routers.DefaultRouter()
router.register(r'fosas', FOSAViewSet)
router.register(r'history', FOSAHistoryViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('fosa.urls')),
]
