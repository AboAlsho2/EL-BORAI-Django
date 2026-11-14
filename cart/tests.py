from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from products.models import Category, Product
from .models import Cart, CartItem

User = get_user_model()


class CartTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="customer1", password="TestPass123!", role="CUSTOMER"
        )
        self.merchant = User.objects.create_user(
            username="merchant1", password="TestPass123!", role="MERCHANT"
        )
        self.category = Category.objects.create(name="Tech")
        self.product = Product.objects.create(
            name="Mouse", price="50.00", stock=20, category=self.category, merchant=self.merchant
        )

    def test_add_to_cart(self):
        self.client.force_authenticate(user=self.user)
        url = reverse("cart-add")
        res = self.client.post(url, {"product_id": self.product.id, "quantity": 2}, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data["items"]), 1)
        self.assertEqual(res.data["items"][0]["quantity"], 2)

    def test_get_cart(self):
        self.client.force_authenticate(user=self.user)
        CartItem.objects.create(
            cart=Cart.objects.create(user=self.user),
            product=self.product,
            quantity=1,
        )
        res = self.client.get(reverse("cart"))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data["items"]), 1)

    def test_update_quantity(self):
        self.client.force_authenticate(user=self.user)
        cart = Cart.objects.create(user=self.user)
        CartItem.objects.create(cart=cart, product=self.product, quantity=1)
        url = reverse("cart-item", args=[self.product.id])
        res = self.client.put(url, {"quantity": 5}, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["items"][0]["quantity"], 5)

    def test_remove_item(self):
        self.client.force_authenticate(user=self.user)
        cart = Cart.objects.create(user=self.user)
        CartItem.objects.create(cart=cart, product=self.product, quantity=1)
        url = reverse("cart-item", args=[self.product.id])
        res = self.client.delete(url)
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
