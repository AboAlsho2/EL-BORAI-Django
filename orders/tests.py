from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from products.models import Category, Product
from cart.models import Cart, CartItem
from .models import Order

User = get_user_model()


class OrderTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="customer1", password="TestPass123!", role="CUSTOMER"
        )
        self.merchant = User.objects.create_user(
            username="merchant1", password="TestPass123!", role="MERCHANT"
        )
        self.category = Category.objects.create(name="Tech")
        self.product = Product.objects.create(
            name="Keyboard", price="100.00", stock=10, category=self.category, merchant=self.merchant
        )
        self.cart = Cart.objects.create(user=self.user)
        CartItem.objects.create(cart=self.cart, product=self.product, quantity=2)

    def test_create_order(self):
        self.client.force_authenticate(user=self.user)
        url = reverse("order-create")
        res = self.client.post(url, {"shipping_address": "Cairo"}, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["total_price"], "200.00")
        self.assertEqual(len(res.data["items"]), 1)
        # Stock reduced
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 8)
        # Cart cleared
        self.assertEqual(self.cart.items.count(), 0)

    def test_list_orders(self):
        Order.objects.create(user=self.user, total_price="200.00")
        self.client.force_authenticate(user=self.user)
        res = self.client.get(reverse("order-list"))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(res.data), 1)

    def test_create_order_empty_cart(self):
        self.cart.items.all().delete()
        self.client.force_authenticate(user=self.user)
        res = self.client.post(reverse("order-create"), {}, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
