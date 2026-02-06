import os
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# --- CONFIGURACIÓN DE SEGURIDAD ---
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-fallback-key-cambiame')

# En Render, DEBUG debe ser False.
DEBUG = os.getenv('DEBUG', 'False') == 'True'

# 1. CORRECCIÓN DE ALLOWED HOSTS
ALLOWED_HOSTS = [
    'lacocinadelcapitan.onrender.com',
    'localhost',
    '127.0.0.1',
    '.render.com'
]

# Si tienes un dominio personalizado en el .env, lo agregamos
env_hosts = os.getenv('ALLOWED_HOSTS')
if env_hosts:
    ALLOWED_HOSTS.extend(env_hosts.split(','))

# --- APLICACIONES ---
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',  # Requisito para CORS
    'rest_framework',
    'api',
    'menu',
]

# --- MIDDLEWARE ---
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # DEBE IR PRIMERO
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # Para archivos estáticos en Render
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# --- 2. CORRECCIÓN DE CORS ---
# Permitimos todo durante la fase de despliegue para evitar bloqueos
CORS_ALLOW_ALL_ORIGINS = True 
CORS_ALLOW_CREDENTIALS = True

# 3. CORRECCIÓN DE CSRF (Necesario para Auth y Checkout)
CSRF_TRUSTED_ORIGINS = [
    "https://lacocinadelcapitanterminado.pages.dev",
    "https://lacocinadelcapitan.onrender.com"
]

ROOT_URLCONF = 'restaurante_config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'restaurante_config.wsgi.application'

# --- BASE DE DATOS ---
DATABASES = {
    'default': dj_database_url.config(
        default=os.getenv('DATABASE_URL', 'postgresql://postgres:123456@127.0.0.1:5432/restaurante_django'),
        conn_max_age=600
    )
}

# --- VALIDACIÓN DE CONTRASEÑAS ---
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# --- INTERNACIONALIZACIÓN ---
LANGUAGE_CODE = 'es-ar'
TIME_ZONE = 'America/Argentina/Buenos_Aires'
USE_I18N = True
USE_TZ = True

# --- ARCHIVOS ESTÁTICOS Y MEDIA ---
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Configuración para servir archivos estáticos eficientemente en producción
if not DEBUG:
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

WHITENOISE_USE_FINDERS = True

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'media'),
]

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'