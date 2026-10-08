# Portfolio Lazareth — Django + Neon + Vercel

## 1. Development lokal
```bash
python -m venv venv && source venv/bin/activate     # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                                  # isi DATABASE_URL (Neon) & Cloudinary
python manage.py makemigrations portfolio
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```
Buka http://127.0.0.1:8000/admin/ → isi **Profil**, **Skill**, **Project** (upload foto di sini).

## 2. Deploy ke Vercel
1. Push ke GitHub (folder `portfolio/migrations/` HARUS ikut ter-commit).
2. Import repo di vercel.com.
3. Environment Variables: `SECRET_KEY`, `DATABASE_URL`, `CLOUDINARY_CLOUD_NAME`,
   `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (DEBUG biarkan kosong/False).
4. Deploy. Migrasi dijalankan dari komputer lokal (langkah 1), karena database Neon-nya sama.
