from django.db import models

class Plato(models.Model):
    CATEGORIAS = [
        ('AL_FUEGO', '🔥 AL FUEGO'),
        ('BURGUERS', 'BURGUERS'),
        ('PIZZAS', 'PIZZAS'),
        ('EMPANADAS', 'EMPANADAS'),
        ('POSTRES', 'POSTRES'),
        ('BEBIDAS', 'BEBIDAS'),
    ]
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    categoria = models.CharField(max_length=50, choices=CATEGORIAS, default='AL_FUEGO')
    imagen = models.ImageField(upload_to='platos/', null=True, blank=True)    
    es_vegetariano = models.BooleanField(default=False)
    es_picante = models.BooleanField(default=False)
    disponible = models.BooleanField(default=True)
    en_oferta = models.BooleanField(default=False)
    porcentaje_descuento = models.IntegerField(default=0)
    stock = models.IntegerField(default=100)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.categoria}] {self.nombre}"

class Ajustes(models.Model):
    mantenimiento = models.BooleanField(default=False)
    class Meta:
        verbose_name_plural = "Ajustes"
    def __str__(self):
        return "Configuración Global"

class Venta(models.Model):
    # Campos que vienen de React
    productos = models.TextField() # Guardaremos un resumen de los productos
    total = models.DecimalField(max_digits=10, decimal_places=2)
    metodo_pago = models.CharField(max_length=20) # MP o WA
    metodo_entrega = models.CharField(max_length=20) # LOCAL o ENVIO
    
    # Datos del cliente para la entrega
    direccion = models.CharField(max_length=255, blank=True, null=True)
    telefono = models.CharField(max_length=50, blank=True, null=True)
    
    fecha = models.DateTimeField(auto_now_add=True)
    entregado = models.BooleanField(default=False)

    def __str__(self):
        return f"Pedido #{self.id} - ${self.total} ({self.fecha.strftime('%d/%m %H:%M')})"