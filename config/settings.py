import os
from pathlib import Path
from urllib.parse import urlparse, parse_qsl

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("SECRET_KEY", "dev-insecure-key-ganti-di-production")
DEBUG = os.getenv("DEBUG", "False") == "True"

ALLOWED_HOSTS = [".vercel.app", "localhost", "127.0.0.1"] + [
    h.strip() for h in os.getenv("ALLOWED_HOSTS", "").split(",") if h.strip()
]
CSRF_TRUSTED_ORIGINS = ["https://*.vercel.app"] + [
    o.strip() for o in os.getenv("CSRF_TRUSTED_ORIGINS", "").split(",") if o.strip()
]

# Cloudinary aktif otomatis jika env-nya diisi (wajib di Vercel)
USE_CLOUDINARY = bool(os.getenv("CLOUDINARY_CLOUD_NAME"))

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
] + (["cloudinary_storage", "cloudinary"] if USE_CLOUDINARY else []) + [
    "portfolio",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# ---------------------------------------------------------------- Database (Neon)
tmpPostgres_raw_db_url = os.getenv("DATABASE_URL", "").strip().strip("'\"")
if _raw_db_url.startswith("psql "):
    _raw_db_url = _raw_db_url[5:].strip().strip("'\"")
tmpPostgres = urlparse(_raw_db_url)

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": tmpPostgres.path.replace("/", ""),
        "USER": tmpPostgres.username,
        "PASSWORD": tmpPostgres.password,
        "HOST": tmpPostgres.hostname,
        "PORT": 5432,
        "OPTIONS": dict(parse_qsl(tmpPostgres.query)),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "id"
TIME_ZONE = "Asia/Jakarta"
USE_I18N = True
USE_TZ = True

# ---------------------------------------------------------------- Static & Media
STATIC_URL = "/static/"
STATICFILES_DIRS = [BASE_DIR / "static"]
# Hasil collectstatic -> disajikan Vercel lewat @vercel/static-build (distDir)
STATIC_ROOT = BASE_DIR / "staticfiles_build" / "static"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

if USE_CLOUDINARY:
    CLOUDINARY_STORAGE = {
        "CLOUD_NAME": os.getenv("CLOUDINARY_CLOUD_NAME"),
        "API_KEY": os.getenv("CLOUDINARY_API_KEY"),
        "API_SECRET": os.getenv("CLOUDINARY_API_SECRET"),
    }
    default_storage = "cloudinary_storage.storage.MediaCloudinaryStorage"
else:
    default_storage = "django.core.files.storage.FileSystemStorage"

STORAGES = {
    "default": {"BACKEND": default_storage},
    "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
