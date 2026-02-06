from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Importamos las vistas necesarias
from menu.views import PlatoViewSet, VentaViewSet, toggle_maintenance, checkout, register_user

# 1. Configuramos el Router para las APIs automáticas
router = DefaultRouter()
router.register(r'platos', PlatoViewSet, basename='plato') # Crea /api/platos/
router.register(r'sales', VentaViewSet, basename='venta')  # Crea /api/sales/

urlpatterns = [
    path('admin/', admin.site.urls),

    # --- AUTENTICACIÓN Y REGISTRO ---
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', register_user, name='register'),

    # --- API ---
    path('api/', include(router.urls)), # Incluye platos y sales
    path('api/settings/maintenance/', toggle_maintenance, name='maintenance'),
    
    # --- RUTA DE COMPRA (CHECKOUT) ---
    path('api/checkout/', checkout, name='checkout'), 
]

# --- ARCHIVOS ESTÁTICOS Y MULTIMEDIA ---
# Esto permite que Django "entregue" las fotos de los platos en tu PC local
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)