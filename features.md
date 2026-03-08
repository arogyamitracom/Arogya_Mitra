# Arogya Mitra — Features

> AI-Based Personal Health Tracking & Risk Monitoring System

---

## 1. User Authentication & Account Management

- **Email-based registration** with first name, last name, date of birth
- **JWT authentication** — access tokens (1hr) + refresh tokens (30 days)
- **Automatic token refresh** — seamless session continuity without re-login
- **Protected routes** — unauthenticated users are redirected to login
- **Public route guards** — logged-in users are redirected to dashboard
- **Custom User model** — extends Django's `AbstractBaseUser` + `PermissionsMixin` with email as primary identifier

---

## 2. Security Measures

- **Rate limiting** — 20 requests/min per anonymous user (brute-force protection)
- **Django password validators** — rejects common passwords, numeric-only passwords, and passwords similar to user attributes
- **Password hashing** — uses Django's default PBKDF2 hasher (industry standard)
- **JWT token type validation** — access and refresh tokens are type-checked to prevent misuse
- **CORS protection** — only whitelisted origins can access the API
- **Explicit auth classes** — DRF default session/basic auth disabled; only custom JWT decorator grants access
- **Environment-based secrets** — `SECRET_KEY`, DB credentials, email credentials stored in `.env`

---

## 3. Email System

- **Welcome email** on registration with HTML + plain-text versions
- **Non-blocking delivery** — emails sent in background threads (doesn't slow down API response)
- **Gmail SMTP** integration via Django's email backend

---

## 4. Frontend (React)

- **Single Page Application** using React Router v6
- **Lazy loading** — pages loaded on-demand with `React.lazy` + `Suspense`
- **Loading screen** — shown during auth verification and lazy-loaded page transitions
- **Client-side form validation** — real-time error clearing on input change
- **Backend error mapping** — API validation errors displayed under the correct form fields
- **Responsive design** — custom CSS for all pages
- **Theme support** — `ThemeContext` for dark/light mode toggling
- **Reusable components** — `InputField`, `StatCard`, `AlertPanel`, `GoalTracker`, `Sidebar`

---

## 5. Admin Panel

- **Django Admin** with Jazzmin theme (modern UI)
- **Custom admin configuration** — proper fieldsets for the custom User model
- **User management** — create, edit, search, filter users from admin panel

---

## 6. Dashboard

- **Stat cards** — visual health data summary
- **Alert panel** — health warnings and notifications
- **Goal tracker** — track health goals
- **Sidebar navigation** — collapsible sidebar with navigation links

---

## 7. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register/` | User registration |
| POST | `/api/login/` | User login (returns JWT tokens) |
| POST | `/api/token/refresh/` | Refresh access token |
| GET | `/api/profile/` | Get authenticated user's profile |

---

## 8. Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Django 6.0, Django REST Framework |
| **Frontend** | React 18, React Router v6 |
| **Database** | MySQL |
| **Auth** | Custom JWT (PyJWT) |
| **Email** | Gmail SMTP |
| **Admin** | Django Admin + Jazzmin |
| **Deployment** | PythonAnywhere (backend), Vercel (frontend) |

---

## 9. Project Structure

```
Arogya-Mitra/
├── backend/
│   ├── backend/          # Django project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── users/            # Users app
│   │   ├── models.py     # Custom User model
│   │   ├── views.py      # API views
│   │   ├── serializers.py # DRF serializers
│   │   ├── auth.py       # JWT token utilities
│   │   ├── decorators.py # @jwt_required decorator
│   │   ├── utils.py      # Email utilities
│   │   ├── admin.py      # Admin configuration
│   │   ├── urls.py       # URL routing
│   │   └── tests/        # Unit tests
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   ├── context/      # Auth & Theme contexts
│   │   ├── App.js        # Root component + routing
│   │   └── index.js      # Entry point
│   └── .env              # API base URL config
└── requirements.txt
```

---

*Last updated: March 2026*
