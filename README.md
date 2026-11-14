# EL-BORAI — Django Edition (دكان البرعي)

E-commerce for spare parts & hardware, inspired by «لن أعيش في جلباب أبي».

## Backend
```bash
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver
```
- API Docs: http://localhost:8000/api/docs/

## Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
- App: http://localhost:5173

## UI Naming (Arabic)
| English | في الواجهة |
|---------|------------|
| Home | المحلة |
| Products | البضاعة |
| Cart | الشكارة |
| My Orders | دفتري |
| Merchant products | بضاعتي |
| Login | دخول المحل |
| Register | افتح حساب |
| Checkout | خلّص الحساب |

## Status
- ✅ Phase 1–4: Backend complete
- ✅ Phase 5: React integration (JWT auth, Arabic labels, orders/checkout)
- ⏳ Phase 6: Deploy
