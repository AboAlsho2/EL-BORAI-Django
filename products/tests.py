from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Category, Product

User = get_user_model()


class ProductTests(APITestCase):
    def setUp(self):
        self.merchant = User.objects.create_user(
            username="merchant1",
            email="m@test.com",
            password="TestPass123!",
            role="MERCHANT",
        )
        self.customer = User.objects.create_user(
            username="customer1",
            email="c@test.com",
            password="TestPass123!",
            role="CUSTOMER",
        )
        self.category = Category.objects.create(name="Electronics")
        self.product = Product.objects.create(
            name="Phone",
            description="Smart phone",
            price="999.99",
            stock=10,
            category=self.category,
            merchant=self.merchant,
        )

    def test_list_products_public(self):
        url = reverse("product-list")
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(res.data["results"]), 1)

    def test_retrieve_product_public(self):
        url = reverse("product-detail", args=[self.product.id])
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["name"], "Phone")

    def test_create_product_as_merchant(self):
        self.client.force_authenticate(user=self.merchant)
        url = reverse("product-list")
        data = {
            "name": "Laptop",
            "description": "Gaming laptop",
            "price": "1500.00",
            "stock": 5,
            "category": self.category.id,
        }
        res = self.client.post(url, data, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Product.objects.filter(name="Laptop").count(), 1)
        product = Product.objects.get(name="Laptop")
        self.assertEqual(product.merchant, self.merchant)

    def test_create_product_as_customer_forbidden(self):
        self.client.force_authenticate(user=self.customer)
        url = reverse("product-list")
        data = {
            "name": "Hack",
            "price": "10.00",
            "stock": 1,
            "category": self.category.id,
        }
        res = self.client.post(url, data, format="json")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_own_product(self):
        self.client.force_authenticate(user=self.merchant)
        url = reverse("product-detail", args=[self.product.id])
        res = self.client.patch(url, {"price": "899.99"}, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.product.refresh_from_db()
        self.assertEqual(str(self.product.price), "899.99")

    def test_delete_own_product(self):
        self.client.force_authenticate(user=self.merchant)
        url = reverse("product-detail", args=[self.product.id])
        res = self.client.delete(url)
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Product.objects.filter(id=self.product.id).exists())

    def test_list_categories_public(self):
        url = reverse("category-list")
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_create_category_as_merchant(self):
        self.client.force_authenticate(user=self.merchant)
        url = reverse("category-list")
        res = self.client.post(url, {"name": "Books"}, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
