from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['POST'])
@permission_classes([AllowAny]) # Permite que cualquiera se registre
def register_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'detail': 'Faltan datos'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=email).exists():
        return Response({'detail': 'Este email ya está registrado'}, status=status.HTTP_400_BAD_REQUEST)

    # Creamos el usuario en PostgreSQL (usamos email como username)
    user = User.objects.create_user(username=email, email=email, password=password)
    
    # Generamos tokens para que loguee automáticamente al registrarse
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'access': str(refresh.access_token),
        'email': user.email,
        'is_admin': user.is_staff
    }, status=status.HTTP_201_CREATED)