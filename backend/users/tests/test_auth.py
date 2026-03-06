from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from unittest.mock import patch
from users.models import User
from django.contrib.auth.hashers import make_password


class AuthTests(APITestCase):
    def setUp(self):
        # Create a user for login tests
        self.user = User.objects.create(
            first_name="Test",
            last_name="User",
            email="testuser@example.com",
            password_hash=make_password("password123"),
            date_of_birth="2000-01-01"
        )
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.valid_register_payload = {
            "first_name": "Jane",
            "last_name": "Doe",
            "email": "janedoe@example.com",
            "password": "securepassword",
            "date_of_birth": "1995-05-15"
        }

    @patch('users.views.threading')
    def test_register_success(self, mock_threading):
        """Test user can register successfully"""
        response = self.client.post(self.register_url, self.valid_register_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['message'], "Registration successful.")
        
        # Verify user was created in the database
        self.assertTrue(User.objects.filter(email="janedoe@example.com").exists())
        mock_threading.Thread.assert_called_once()  # Background thread was initialized
        mock_threading.Thread.return_value.start.assert_called_once()  # Thread was started

    def test_register_missing_fields(self):
        """Test registration fails when required fields are missing"""
        invalid_payload = {
            "first_name": "Jane",
            # missing email and password
        }
        response = self.client.post(self.register_url, invalid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
        self.assertIn('password', response.data)

    def test_register_existing_email(self):
        """Test registration fails if email already exists"""
        # Attempt to register with the setup user's email
        invalid_payload = self.valid_register_payload.copy()
        invalid_payload["email"] = "testuser@example.com"
        
        response = self.client.post(self.register_url, invalid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
        self.assertTrue(any('already exists' in str(error).lower() for error in response.data['email']))

    def test_login_success(self):
        """Test user can login successfully with correct credentials"""
        payload = {
            "email": "testuser@example.com",
            "password": "password123"
        }
        response = self.client.post(self.login_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], "Login successful.")
        self.assertEqual(response.data['user']['email'], "testuser@example.com")
        self.assertEqual(response.data['user']['first_name'], "Test")

    def test_login_invalid_email(self):
        """Test login fails with non-existent email"""
        payload = {
            "email": "wrongemail@example.com",
            "password": "password123"
        }
        response = self.client.post(self.login_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('email', response.data)

    def test_login_invalid_password(self):
        """Test login fails with correct email but incorrect password"""
        payload = {
            "email": "testuser@example.com",
            "password": "wrongpassword"
        }
        response = self.client.post(self.login_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('password', response.data)
