from django.contrib.auth.models import User
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Plato, Venta, Ajustes
from .serializers import PlatoSerializer, VentaSerializer

# --- VIEWSETS PARA EL CRUD ---

class PlatoViewSet(viewsets.ModelViewSet):
    queryset = Plato.objects.all().order_by('-id')
    serializer_class = PlatoSerializer

class VentaViewSet(viewsets.ModelViewSet):
    """
    Filtramos para que el Admin Panel solo vea ventas 
    que NO sean de WhatsApp por defecto si prefieres.
    """
    queryset = Venta.objects.all().order_by('-fecha')
    serializer_class = VentaSerializer

# --- FUNCIONES DE LA API ---

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Crea un nuevo usuario en la base de datos de PostgreSQL.
    """
    data = request.data
    try:
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return Response({'error': 'Email y contraseña son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=email).exists():
            return Response({'error': 'Este email ya está registrado'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password
        )
        return Response({'message': '¡Cuenta del Capitán creada con éxito!'}, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST', 'GET'])
def toggle_maintenance(request):
    """
    Controla el estado de mantenimiento (abierto/cerrado) del restaurante.
    """
    config, created = Ajustes.objects.get_or_create(id=1)
    if request.method == 'POST':
        val = request.data.get('value')
        if val is not None:
            config.mantenimiento = val
            config.save()
    return Response({'value': config.mantenimiento})

@api_view(['POST'])
def checkout(request):
    """
    Procesa el pedido:
    1. Si es WhatsApp: Solo responde OK para que el front redirija.
    2. Si es Mercado Pago u otro: Descuenta stock y guarda la venta.
    """
    try:
        data = request.data
        items = data.get('items', [])
        detalles_entrega = data.get('detalles_entrega', {})
        metodo_pago = data.get('metodo') # Se espera 'WA' o 'MP'

        # --- LÓGICA DE WHATSAPP ---
        # Si es WhatsApp, NO guardamos en DB ni descontamos stock.
        if metodo_pago == 'WA':
            return Response({
                "status": "wa_redirect", 
                "message": "Pedido listo para WhatsApp"
            }, status=status.HTTP_200_OK)

        # --- LÓGICA DE VENTA CONFIRMADA (Mercado Pago / Online) ---
        resumen = ""
        for item in items:
            p = Plato.objects.get(id=item['id'])
            
            # Verificación de Stock antes de procesar
            if p.stock < item['quantity']:
                return Response(
                    {"error": f"Lo sentimos, no queda suficiente stock de {p.nombre}"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            resumen += f"{item['quantity']}x {p.nombre}, "
            
            # Descontar stock
            p.stock -= item['quantity']
            p.save()

        # Crear el registro de venta físico en la base de datos
        nueva_venta = Venta.objects.create(
            productos=resumen.strip(", "),
            total=data.get('total'),
            metodo_pago=metodo_pago,
            metodo_entrega=data.get('entrega'),
            direccion=detalles_entrega.get('direccion'),
            telefono=detalles_entrega.get('telefono')
        )

        return Response({"status": "ok", "id": nueva_venta.id}, status=status.HTTP_201_CREATED)
    
    except Plato.DoesNotExist:
        return Response({"error": "Uno de los platos no existe en la carta"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)