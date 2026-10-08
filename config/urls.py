from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

admin.site.site_header = "Portofolio — Admin Portfolio"
admin.site.site_title = "Portofolio Admin"
admin.site.index_title = "Kelola konten portfolio"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("portfolio.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
