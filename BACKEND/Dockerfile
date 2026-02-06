# Usamos una imagen de Python oficial y liviana
FROM python:3.11-slim

# Evita que Python genere archivos .pyc y permite que los logs salgan directo
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Instalamos dependencias del sistema necesarias para psycopg2 y Pillow
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    libjpeg-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

# Instalamos las dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos el resto del código
COPY . .

# Ejecutamos collectstatic (esto es seguro aquí porque DEBUG será False)
RUN python manage.py collectstatic --no-input

# Comando para arrancar la app
CMD ["gunicorn", "restaurante_config.wsgi:application", "--bind", "0.0.0.0:10000"]