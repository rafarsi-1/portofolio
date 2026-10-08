from django.db import models


class Profile(models.Model):
    full_name = models.CharField("Nama lengkap", max_length=120, default="Portofolio")
    headline = models.CharField(
        "Headline", max_length=200, default="Software Engineer — Django & Web Development"
    )
    bio = models.TextField("Bio", blank=True)
    profile_picture = models.ImageField("Foto profil", upload_to="profile/", blank=True, null=True)
    email = models.EmailField("Email", blank=True)
    github_url = models.URLField("GitHub", blank=True)
    linkedin_url = models.URLField("LinkedIn", blank=True)

    class Meta:
        verbose_name = "Profil"
        verbose_name_plural = "Profil"

    def __str__(self):
        return self.full_name


class Skill(models.Model):
    name = models.CharField("Nama skill", max_length=80)
    level = models.CharField("Level", max_length=40, blank=True, help_text="Mis. Advanced / Intermediate")
    order = models.PositiveIntegerField("Urutan", default=0)

    class Meta:
        ordering = ["order", "name"]
        verbose_name = "Skill"
        verbose_name_plural = "Skill"

    def __str__(self):
        return self.name


class Project(models.Model):
    title = models.CharField("Judul", max_length=150)
    description = models.TextField("Deskripsi")
    image = models.ImageField("Gambar", upload_to="projects/", blank=True, null=True)
    tech_stack = models.CharField(
        "Tech stack", max_length=250, blank=True, help_text="Pisahkan dengan koma: Django, PostgreSQL, Docker"
    )
    repo_url = models.URLField("Repository URL", blank=True)
    demo_url = models.URLField("Live demo URL", blank=True)
    is_published = models.BooleanField("Tampilkan", default=True)
    order = models.PositiveIntegerField("Urutan", default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "-created_at"]
        verbose_name = "Project"
        verbose_name_plural = "Project"

    def __str__(self):
        return self.title


class ContactMessage(models.Model):
    name = models.CharField("Nama", max_length=120)
    email = models.EmailField("Email")
    message = models.TextField("Pesan")
    is_read = models.BooleanField("Sudah dibaca", default=False)
    created_at = models.DateTimeField("Dikirim", auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Pesan masuk"
        verbose_name_plural = "Pesan masuk"

    def __str__(self):
        return f"{self.name} <{self.email}>"
