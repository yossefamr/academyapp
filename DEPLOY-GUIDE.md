# 🚀 دليل رفع موقع Lycans Fight Club على الإنترنت

فيه 3 طرق مجانية لرفع الموقع — اختر اللي يناسبك.
كل الطرق بتدّي رابط HTTPS جاهز للتحويل لـ APK.

---

## ⭐ الطريقة الأولى: Vercel (الأسهل والأفضل — مجاني 100%)

**ليه Vercel؟** ده الشركة اللي عملت Next.js — أسرع نشر، HTTPS تلقائي، نطاق فرعي مجاني `lycans.vercel.app`.

### الخطوات:

#### 1) ارفع المشروع على GitHub
```bash
# في مجلد المشروع، شغّل:
git init
git add -A
git commit -m "Lycans Fight Club - MMA Academy"
git branch -M main

# اعمل repository جديد على github.com (بدون README)
# بعدين انسخ رابط الـ repo واكتب:
git remote add origin https://github.com/USERNAME/lycans-fight-club.git
git push -u origin main
```

> لو معندكش git: نزّل GitHub Desktop من desktop.github.com — أسهل.

#### 2) اربطه مع Vercel
1. ادخل على **https://vercel.com** وسجّل بحساب GitHub
2. اضغط **"Add New Project"**
3. اختار الـ repository بتاعك
4. الإعدادات هتتقرأ تلقائيًا (Framework: Next.js)
5. في **Environment Variables**، ضيف:
   - `DATABASE_URL` = `file:./db/custom.db`
   - `SESSION_SECRET` = أي نص عشوائي طويل (مثلاً: `lycans-2026-super-secret-key-xyz`)
6. اضغط **Deploy** ✅

بعد دقيقتين، الموقع هيبقى شغال على `https://lycans-fight-club.vercel.app` 🎉

#### 3) (اختياري) ربط نطاقك الخاص lycansfightclub.com
1. في Vercel: Project → Settings → Domains
2. ضيف `lycansfightclub.com` و `www.lycansfightclub.com`
3. في لوحة تحكم النطاق بتاعك (Namecheap/GoDaddy)، غيّر الـ DNS:
   - `@` → A record → `76.76.21.21`
   - `www` → CNAME → `cname.vercel-dns.com`

---

## 🌐 الطريقة الثانية: Netlify (بديل مجاني)

1. ارفع المشروع على GitHub (نفس خطوة Vercel الأولى)
2. ادخل **https://app.netlify.com** وسجّل بـ GitHub
3. **"Add new site" → "Import an existing project"**
4. اختار الـ repository
5. الإعدادات:
   - Build command: `bun run vercel-build`
   - Publish directory: `.next`
   - Environment variables: نفس Vercel (`DATABASE_URL`, `SESSION_SECRET`)
6. **Deploy site** ✅

> ملاحظة: Netlify ممكن يحتاج إعداد إضافي للـ API routes. لو واجهت مشاكل، استخدم Vercel (الأنسب لـ Next.js).

---

## 🚂 الطريقة الثالثة: Railway (للقاعدة بيانات الثابتة)

استخدمها لو عايز قاعدة بيانات PostgreSQL حقيقية بدل SQLite.

1. ادخل **https://railway.app** → New Project → Deploy from GitHub repo
2. اختار الـ repository
3. Railway هيعمل build تلقائيًا
4. ضيف PostgreSQL database من **"Add Database"**
5. غيّر `DATABASE_URL` برابط Postgres اللي Railway هيديك
6. عدّل `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"   // بدل sqlite
     url      = env("DATABASE_URL")
   }
   ```
7. Redeploy ✅

---

## 📲 بعد ما الموقع يبقى أونلاين — حوّله لـ APK

بعد ما الموقع يبقى على `https://your-domain.com`، اتبع خطوات `APK-BUILD-GUIDE.md`:

### الطريقة الأسهل (PWABuilder — من المتصفح):
1. افتح **https://www.pwabuilder.com**
2. حط رابط موقعك: `https://lycans-fight-club.vercel.app`
3. اضغط **Start** → **Package For Stores** → **Android**
4. نزّل الـ `.apk` وثبّته على موبايلك 📱

### الطريقة بالتيرمينال (Bubblewrap):
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest=https://lycans-fight-club.vercel.app/manifest.json
bubblewrap build
# هيطلعلك app-release-signed.apk 🎉
```

---

## 🔧 ملاحظات مهمة

### القاعدة بيانات (SQLite)
- الموقع بيستخدم SQLite — كل البيانات بتتخزن في ملف `db/custom.db`
- على Vercel/Netlify، الملف ده بيتعمله reset مع كل deploy جديد (محدودية serverless)
- **لو عايز بيانات دائمة** استخدم PostgreSQL (الطريقة الثالثة Railway) أو Vercel Postgres

### متغيرات البيئة المطلوبة
| المتغير | القيمة | الوصف |
|--------|--------|------|
| `DATABASE_URL` | `file:./db/custom.db` | مسار قاعدة البيانات |
| `SESSION_SECRET` | نص عشوائي طويل | سر تشفير الجلسات |

### تشغيل الـ seed (بيانات تجريبية)
بعد أول نشر، شغّل الـ seed لإضافة الأعضاء التجريبيين:
```bash
# على Vercel:
vercel bun run prisma/seed.ts

# أو محليًا ضد قاعدة بيانات الإنتاج:
DATABASE_URL="file:./db/custom.db" bun run prisma/seed.ts
```

### الدخول التجريبي
- **Super Admin:** `alpha@lycans.club` / `lycans123`
- **Coach:** `coach@lycans.club` / `lycans123`
- **Trainee:** `trainee1@lycans.club` / `lycans123`

---

## ✅ قائمة التحقق قبل النشر

- [ ] المشروع مرفوع على GitHub
- [ ] `DATABASE_URL` مضبوط في Environment Variables
- [ ] `SESSION_SECRET` مضاف كـ Secret
- [ ] أول deploy نجح والموقع شغال على HTTPS
- [ ] الـ seed شغّال (تقدر تسجّل دخول بـ coach@lycans.club)
- [ ] حولته لـ APK من PWABuilder

---

## 🆘 مشاكل شائعة

**الموقع بيفتح بس مفيش بيانات؟**
→ شغّل الـ seed: `bun run prisma/seed.ts`

**الـ APK مش بيشتغل؟**
→ تأكد إن الموقع على HTTPS، وإن `manifest.json` متاح على `/manifest.json`

**الـ QR scanner مش بيفتح الكاميرا؟**
→ الكاميرا محتاجة HTTPS (أي استضافة من اللي فوق بتدّي HTTPS تلقائيًا)

---

🐺 **Lycans Fight Club - MMA Academy** · Fearless Fighters
