from functools import wraps
from rest_framework.response import Response
from rest_framework import status
from .auth import decode_token
from .models import User


def jwt_required(view_func):
    """Decorator that requires a valid JWT access token in the Authorization header."""
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        auth_header = request.headers.get('Authorization', '')

        if not auth_header.startswith('Bearer '):
            return Response(
                {'error': 'Authorization header must be: Bearer <token>'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        token = auth_header.split(' ', 1)[1]

        try:
            payload = decode_token(token, expected_type='access')
        except ValueError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            request.user = User.objects.get(id=payload['user_id'])
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return view_func(request, *args, **kwargs)

    return wrapper
