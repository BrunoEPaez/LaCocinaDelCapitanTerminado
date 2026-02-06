from django.contrib import admin
from .models import Plato, Venta, Ajustes 

@admin.register(Plato)
class PlatoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'categoria', 'precio', 'disponible', 'en_oferta')
    list_filter = ('categoria', 'disponible', 'es_vegetariano')
    search_fields = ('nombre', 'descripcion')

# Venta y Ajustes se registran de forma sencilla
admin.site.register(Venta)
admin.site.register(Ajustes)