# Arogya Mitra — Backend App Structure

Per `Airule.md` Rule 4: *"follow app rule in django, split into multiple apps if needed."*

## Current Structure

```
backend/
├── backend/          # Project config (settings, urls, wsgi)
└── users/            # Auth, registration, JWT, email
```

## Planned App Split

Split into separate Django apps as each module is implemented:

| App | Responsibility | Key Models |
|-----|---------------|------------|
| `users` | Registration, login, JWT, profile, email | `User`, `UserProfile` |
| `health` | Daily health data logging, validation | `HealthRecord` |
| `analytics` | BMI calculation, health score, trends | `BMIHistory`, `HealthScore` |
| `predictions` | ML risk prediction (diabetes, heart) | `RiskPrediction` |
| `alerts` | Smart alerts, goal notifications | `Alert`, `Goal` |
| `reports` | Monthly PDF report generation | `Report` |

## Shared Utilities

JWT auth files (`auth.py`, `decorators.py`) stay in `users` since they're tied to the User model. If shared utilities grow, extract into a `core` app.

## How to Create a New App

```bash
cd backend
python manage.py startapp <app_name>
```

Then add `'<app_name>'` to `INSTALLED_APPS` in `settings.py` and include its URLs in `backend/urls.py`:

```python
path('api/', include('<app_name>.urls')),
```
