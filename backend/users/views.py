import logging
import threading

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import RegisterSerializer, LoginSerializer, UserProfileSerializer
from .utils import send_welcome_email
from .auth import generate_access_token, generate_refresh_token, decode_token
from .decorators import jwt_required
from .models import User

logger = logging.getLogger(__name__)


def _send_email_async(user):
    """Send welcome email in background thread."""
    try:
        send_welcome_email(user)
    except Exception as e:
        logger.warning(f"Failed to send welcome email to {user.email}: {e}")


@api_view(['POST'])
def register_view(request):
    """Handle user registration."""
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()

        # Send welcome email in background thread (non-blocking)
        threading.Thread(target=_send_email_async, args=(user,), daemon=True).start()

        return Response(
            {"message": "Registration successful."},
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login_view(request):
    """Handle user login and return JWT tokens."""
    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.validated_data['user']
        return Response(
            {
                "message": "Login successful.",
                "access_token": generate_access_token(user),
                "refresh_token": generate_refresh_token(user),
                "user": UserProfileSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )

    return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def token_refresh_view(request):
    """Issue a new access token using a valid refresh token."""
    refresh_token = request.data.get('refresh_token')

    if not refresh_token:
        return Response(
            {'error': 'Refresh token is required.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        payload = decode_token(refresh_token, expected_type='refresh')
    except ValueError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    try:
        user = User.objects.get(id=payload['user_id'])
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found.'},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    return Response(
        {'access_token': generate_access_token(user)},
        status=status.HTTP_200_OK,
    )


@api_view(['GET'])
@jwt_required
def user_profile_view(request):
    """Return current authenticated user's profile data."""
    return Response(
        UserProfileSerializer(request.user).data,
        status=status.HTTP_200_OK,
    )
