# النشر: Vercel (فرونت) + Render (backend) + Render Postgres

## 1) GitHub
ارفع المشروع كله (فولدر `frontend` جوه نفس الـ repo).

## 2) Render (backend + قاعدة البيانات)
1. New > Blueprint > اختار الـ repo. هيقرأ `render.yaml` وينشئ الخدمة `elborai-api` والقاعدة `elborai-db`.
2. هيسألك على `CORS_ALLOWED_ORIGINS`: اكتب مؤقتاً `https://placeholder.vercel.app`.
3. استنى الـ build ينجح، وانسخ رابط الخدمة (`https://elborai-api-xxxx.onrender.com`).
4. جرّب `<الرابط>/api/docs/`.

## 3) Vercel (الفرونت)
1. Add New > Project > نفس الـ repo.
2. Root Directory: `frontend` (Framework: Vite، هيتعرف لوحده).
3. Environment Variables: `VITE_API_BASE_URL` = رابط Render من غير `/` في الآخر.
4. Deploy، وانسخ رابط الموقع (`https://xxxx.vercel.app`).

## 4) ربط الاتنين
ارجع Render > الخدمة > Environment وغيّر `CORS_ALLOWED_ORIGINS` لرابط Vercel بالظبط (من غير `/` في الآخر)، وهيعمل Redeploy.

## 5) حساب الأدمن
محلياً، حط في `.env` الـ External Database URL بتاع القاعدة كـ `DATABASE_URL` وشغّل:
`python manage.py createsuperuser`

## تنبيهات
- الـ backend المجاني بينام بعد ١٥ دقيقة، وأول طلب بعده بياخد حوالي دقيقة.
- قاعدة Render Postgres المجانية بتنتهي بعد مدة (٣٠ يوم حسب توثيق Render). قبل ما تنتهي: Backup (`pg_dump`) أو انقل لـ Neon بتغيير `DATABASE_URL` بس.
- روابط Preview في Vercel بتتغير، والـ CORS بيقبل رابط الـ production بس.
