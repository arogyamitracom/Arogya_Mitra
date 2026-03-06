import logging
import threading

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import RegisterSerializer, LoginSerializer
from .utils import send_welcome_email

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
    """Handle user login."""
    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.validated_data['user']
        return Response(
            {
                "message": "Login successful.",
                "user": {
                    "id": user.id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                },
            },
            status=status.HTTP_200_OK,
        )

    return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)
