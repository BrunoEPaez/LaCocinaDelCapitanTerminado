from rest_framework import serializers
from .models import Plato, Venta, Ajustes

class PlatoSerializer(serializers.ModelSerializer):
    # Mapeo de nombres para React
    name = serializers.CharField(source='nombre')
    price = serializers.DecimalField(source='precio', max_digits=10, decimal_places=2)
    description = serializers.CharField(source='descripcion', allow_blank=True, required=False)
    category = serializers.CharField(source='categoria')
    on_sale = serializers.BooleanField(source='en_oferta', required=False)
    discount_percentage = serializers.IntegerField(source='porcentaje_descuento', required=False)
    image = serializers.ImageField(source='imagen', required=False, allow_null=True)

    class Meta:
        model = Plato
        fields = [
            'id', 'name', 'price', 'description', 'category', 
            'image', 'stock', 'on_sale', 'discount_percentage'
        ]

class VentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venta
        fields = '__all__'

class AjustesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ajustes
        fields = '__all__'