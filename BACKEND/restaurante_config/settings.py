import os
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url  # Recomendado para Render

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# --- CONFIGURACIÓN DE SEGURIDAD ---
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-fallback-key-cambiame')

# En Render, DEBUG debe ser False. Localmente será True si lo pones en el .env
DEBUG = os.getenv('DEBUG', 'False') == 'True'

# Permitir localhost y el dominio de Render (el '*' permite todos, útil para el despliegue inicial)
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '127.0.0.1,localhost').split(',')
if not DEBUG:
    ALLOWED_HOSTS.append('.render.com')

# --- APLICACIONES ---
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'api',
    'menu',
]

# --- MIDDLEWARE ---
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # <--- CRITICO PARA RENDER
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# --- CORS ---
CORS_ALLOW_ALL_ORIGINS = DEBUG  # En desarrollo permite todo, en producción puedes restringir
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
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
# Si hay una DATABASE_URL (Render), la usa. Si no, usa la local de Postgres.
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
LANGUAGE_CODE = 'es-ar' # Cambiado a español Argentina
TIME_ZONE = 'America/Argentina/Buenos_Aires'
USE_I18N = True
USE_TZ = True


# --- ARCHIVOS ESTÁTICOS Y MEDIA ---
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Solo usamos el almacenamiento especial de Whitenoise si NO estamos en DEBUG
if not DEBUG:
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')



DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'