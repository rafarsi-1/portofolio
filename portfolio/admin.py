from django.contrib import admin
from django.utils.html import format_html

from .models import ContactMessage, Profile, Project, Skill


def _thumb(image, size=70):
    if image:
        return format_html(
            '<img src="{}" style="height:{}px;width:{}px;object-fit:cover;border-radius:6px;">',
            image.url, size, size,
        )
    return "—"


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("full_name", "headline", "preview")
    readonly_fields = ("preview",)

    @admin.display(description="Foto")
    def preview(self, obj):
        return _thumb(obj.profile_picture, 90)


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ("name", "level", "order")
    list_editable = ("level", "order")


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "preview", "tech_stack", "is_published", "order")
    list_editable = ("is_published", "order")
    search_fields = ("title", "tech_stack")
    readonly_fields = ("preview",)

    @admin.display(description="Gambar")
    def preview(self, obj):
        return _thumb(obj.image)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "is_read", "created_at")
    list_filter = ("is_read", "created_at")
    search_fields = ("name", "email", "message")
    list_editable = ("is_read",)
    readonly_fields = ("name", "email", "message", "created_at")

    def has_add_permission(self, request):
        # Pesan hanya datang dari form kontak, tapi tetap bisa dihapus
        return False