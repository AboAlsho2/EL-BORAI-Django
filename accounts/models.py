from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        CUSTOMER = "CUSTOMER", "Customer"
        MERCHANT = "MERCHANT", "Merchant"
        ADMIN = "ADMIN", "Admin"

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.CUSTOMER,
    )
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)

    def __str__(self):
        return f"{self.username} ({self.role})"

    @property
    def is_customer(self):
        return self.role == self.Role.CUSTOMER

    @property
    def is_merchant(self):
        return self.role == self.Role.MERCHANT

    @property
    def is_admin_user(self):
        return self.role == self.Role.ADMIN or self.is_superuser
