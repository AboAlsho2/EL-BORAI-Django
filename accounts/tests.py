from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class AuthTests(APITestCase):
    def setUp(self):
        self.register_url = reverse("auth-register")
        self.login_url = reverse("auth-login")
        self.me_url = reverse("auth-me")
        self.profile_url = reverse("auth-profile")

    def test_register_customer(self):
        data = {
            "username": "customer1",
            "email": "customer1@test.com",
            "password": "TestPass123!",
            "password_confirm": "TestPass123!",
            "role": "CUSTOMER",
        }
        res = self.client.post(self.register_url, data, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="customer1").exists())
        user = User.objects.get(username="customer1")
        self.assertEqual(user.role, "CUSTOMER")

    def test_register_merchant(self):
        data = {
            "username": "merchant1",
            "email": "merchant1@test.com",
            "password": "TestPass123!",
            "password_confirm": "TestPass123!",
            "role": "MERCHANT",
        }
        res = self.client.post(self.register_url, data, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(username="merchant1")
        self.assertEqual(user.role, "MERCHANT")

    def test_register_password_mismatch(self):
        data = {
            "username": "bad",
            "email": "bad@test.com",
            "password": "TestPass123!",
            "password_confirm": "WrongPass123!",
        }
        res = self.client.post(self.register_url, data, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_and_me(self):
        User.objects.create_user(
            username="testuser",
            email="test@test.com",
            password="TestPass123!",
            role="CUSTOMER",
        )
        res = self.client.post(
            self.login_url,
            {"username": "testuser", "password": "TestPass123!"},
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("access", res.data)
        self.assertIn("refresh", res.data)
        self.assertIn("user", res.data)
        self.assertEqual(res.data["user"]["role"], "CUSTOMER")

        # /me with token
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {res.data['access']}")
        me = self.client.get(self.me_url)
        self.assertEqual(me.status_code, status.HTTP_200_OK)
        self.assertEqual(me.data["username"], "testuser")

    def test_me_unauthenticated(self):
        res = self.client.get(self.me_url)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_update(self):
        user = User.objects.create_user(
            username="upd",
            email="upd@test.com",
            password="TestPass123!",
        )
        self.client.force_authenticate(user=user)
        res = self.client.patch(
            self.profile_url,
            {"first_name": "Ahmed", "phone": "01000000000"},
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertEqual(user.first_name, "Ahmed")
        self.assertEqual(user.phone, "01000000000")
