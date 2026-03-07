import jwt
import datetime
from django.conf import settings


def generate_access_token(user):
    """Generate a JWT access token (1 hour expiry)."""
    payload = {
        'user_id': user.id,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'type': 'access',
        'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1),
        'iat': datetime.datetime.now(datetime.timezone.utc),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')


def generate_refresh_token(user):
    """Generate a JWT refresh token (30 days expiry)."""
    payload = {
        'user_id': user.id,
        'type': 'refresh',
        'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=30),
        'iat': datetime.datetime.now(datetime.timezone.utc),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')


def decode_token(token, expected_type='access'):
    """Decode and validate a JWT token. Returns payload or raises exception."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        raise ValueError('Token has expired.')
    except jwt.InvalidTokenError:
        raise ValueError('Invalid token.')

    if payload.get('type') != expected_type:
        raise ValueError(f'Expected {expected_type} token.')

    return payload
