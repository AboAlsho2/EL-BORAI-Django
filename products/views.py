from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters, permissions
from rest_framework.permissions import AllowAny, IsAuthenticated

from accounts.permissions import IsMerchantOrAdmin
from .models import Category, Product
from .serializers import (
    CategorySerializer,
    ProductSerializer,
    ProductCreateUpdateSerializer,
)
from .permissions import IsMerchantOwnerOrReadOnly


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name"]
    ordering_fields = ["name", "created_at"]

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [AllowAny()]
        return [IsAuthenticated(), IsMerchantOrAdmin()]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related("category", "merchant").prefetch_related("images")
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["category", "merchant", "is_active"]
    search_fields = ["name", "description"]
    ordering_fields = ["price", "created_at", "name", "stock"]
    ordering = ["-created_at"]

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [AllowAny()]
        return [IsAuthenticated(), IsMerchantOwnerOrReadOnly()]

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return ProductCreateUpdateSerializer
        return ProductSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        # Merchants can filter to their own products via ?mine=1
        if self.request.query_params.get("mine") == "1" and self.request.user.is_authenticated:
            if self.request.user.role == "MERCHANT":
                qs = qs.filter(merchant=self.request.user)
        return qs

    def perform_create(self, serializer):
        serializer.save(merchant=self.request.user)
