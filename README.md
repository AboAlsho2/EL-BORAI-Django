# EL-BORAI — Django Edition

E-commerce platform rebuilt with **Django + DRF + React**.

## Quick Start

```bash
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

- Admin: http://localhost:8000/admin/
- Swagger: http://localhost:8000/api/docs/

## Auth Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register (CUSTOMER or MERCHANT) |
| POST | `/api/auth/login/` | Login → access + refresh + user |
| POST | `/api/auth/refresh/` | Refresh token |
| GET | `/api/auth/me/` | Current user |
| GET/PATCH | `/api/auth/profile/` | Profile |

## Products & Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/` | List (public, filter/search/paginate) |
| GET | `/api/products/{id}/` | Detail |
| POST | `/api/products/` | Create (Merchant) |
| PUT/PATCH | `/api/products/{id}/` | Update own product |
| DELETE | `/api/products/{id}/` | Delete own product |
| GET | `/api/categories/` | List categories |
| POST | `/api/categories/` | Create category (Merchant/Admin) |

Query params: `?search=phone&category=1&ordering=-price&mine=1&page=1`

## Roles
- `CUSTOMER` — browse, cart, orders
- `MERCHANT` — manage own products
- `ADMIN` — full access

## Status
- ✅ Phase 1: Foundation
- ✅ Phase 2: Authentication
- ✅ Phase 3: Products & Categories
- ⏳ Phase 4: Cart & Orders
