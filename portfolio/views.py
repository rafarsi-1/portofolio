from django.contrib import messages
from django.shortcuts import redirect, render

from .forms import ContactForm
from .models import Profile, Project, Skill


def index(request):
    if request.method == "POST":
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Pesan terkirim. Terima kasih, saya akan segera membalas!")
        else:
            messages.error(request, "Pesan gagal dikirim. Pastikan semua kolom terisi dengan benar.")
        return redirect("/#contact")

    profile = Profile.objects.first() or Profile()  # fallback agar halaman tetap tampil
    context = {
        "profile": profile,
        "skills": Skill.objects.all(),
        "projects": Project.objects.filter(is_published=True),
    }
    return render(request, "index.html", context)
