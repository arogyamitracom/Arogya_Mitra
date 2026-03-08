from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('token/refresh/', views.token_refresh_view, name='token-refresh'),
    path('profile/', views.user_profile_view, name='user-profile'),
]
