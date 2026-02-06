from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import PlatoViewSet, VentaViewSet, toggle_maintenance, checkout, register_user

router = DefaultRouter()
router.register(r'platos', PlatoViewSet)
router.register(r'sales', VentaViewSet)

urlpatterns = [
    # Autenticación y Registro
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', register_user, name='register'),
    
    # Funciones manuales
    path('api/settings/maintenance/', toggle_maintenance),
    path('api/checkout/', checkout),
    
    # Router
    path('api/', include(router.urls)),
]