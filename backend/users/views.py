import logging
import threading

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import RegisterSerializer, LoginSerializer, UserProfileSerializer, HealthProfileSerializer, HealthLogSerializer
from .utils import send_welcome_email
from .auth import generate_access_token, generate_refresh_token, decode_token
from .decorators import jwt_required
from .models import User, UserProfile, HealthLog

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


@api_view(['GET'])
@jwt_required
def dashboard_view(request):
    """Return all dashboard data for the authenticated user."""
    user = request.user

    # Auto-create health profile if it doesn't exist
    profile, _ = UserProfile.objects.get_or_create(user=user)

    # Get the latest log for stat cards
    latest_log = HealthLog.objects.filter(user=user).first()  # ordered by -date in model Meta

    # BP trend: last 7 logs that have BP data
    bp_logs = HealthLog.objects.filter(
        user=user,
        systolic_bp__isnull=False,
        diastolic_bp__isnull=False,
    ).order_by('date')[:7]

    # Weight trend: last 6 logs that have weight data
    weight_logs = HealthLog.objects.filter(
        user=user,
        weight_kg__isnull=False,
    ).order_by('date')[:6]

    # Compute BMI if possible
    bmi = None
    if profile.height_cm and latest_log and latest_log.weight_kg:
        height_m = float(profile.height_cm) / 100
        bmi = round(float(latest_log.weight_kg) / (height_m ** 2), 1)

    return Response({
        'profile': HealthProfileSerializer(profile).data,
        'latest_log': HealthLogSerializer(latest_log).data if latest_log else None,
        'bmi': bmi,
        'bp_trend': HealthLogSerializer(bp_logs, many=True).data,
        'weight_trend': HealthLogSerializer(weight_logs, many=True).data,
    }, status=status.HTTP_200_OK)
