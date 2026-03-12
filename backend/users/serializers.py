from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password as django_validate_password
from .models import User, UserProfile, HealthLog


class UserProfileSerializer(serializers.ModelSerializer):
    """Reusable serializer for user profile data."""

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email']
        read_only_fields = fields


class HealthProfileSerializer(serializers.ModelSerializer):
    """Serializer for the user's health profile (static body data)."""

    class Meta:
        model = UserProfile
        fields = ['height_cm', 'blood_group', 'current_health_score', 'current_risk_level']
        read_only_fields = fields


class HealthLogSerializer(serializers.ModelSerializer):
    """Serializer for individual health log entries."""
    date = serializers.DateField(format='%Y-%m-%d')

    class Meta:
        model = HealthLog
        fields = ['date', 'weight_kg', 'systolic_bp', 'diastolic_bp', 'heart_rate_bpm']
        read_only_fields = fields


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password', 'date_of_birth']

    def validate_password(self, value):
        django_validate_password(value)
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        return User.objects.create_user(password=password, **validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                {"email": "No account found with this email."}
            )

        if not user.check_password(password):
            raise serializers.ValidationError(
                {"password": "Incorrect password."}
            )

        data['user'] = user
        return data
