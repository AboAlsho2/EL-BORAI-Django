from drf_spectacular.utils import extend_schema
from django.db import transaction
from rest_framework import status, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView

from cart.models import Cart
from products.models import Product
from .models import Order, OrderItem
from .serializers import (
    OrderSerializer,
    CreateOrderSerializer,
    UpdateOrderStatusSerializer,
)
from accounts.permissions import IsAdmin, IsMerchantOrAdmin

@extend_schema(
    request=CreateOrderSerializer,
    responses={201: OrderSerializer},
)
class CreateOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            cart = Cart.objects.prefetch_related("items__product").get(user=request.user)
        except Cart.DoesNotExist:
            return Response({"detail": "Cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        items = list(cart.items.all())
        if not items:
            return Response({"detail": "Cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate stock and calculate total
        total = 0
        for item in items:
            product = item.product
            if not product.is_active:
                return Response(
                    {"detail": f"Product '{product.name}' is no longer available."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if product.stock < item.quantity:
                return Response(
                    {"detail": f"Not enough stock for '{product.name}'. Available: {product.stock}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            total += product.price * item.quantity

        # Create order
        order = Order.objects.create(
            user=request.user,
            total_price=total,
            shipping_address=serializer.validated_data.get("shipping_address", ""),
            status=Order.Status.PENDING,
        )

        # Create order items (price snapshot) + reduce stock
        for item in items:
            product = item.product
            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                price=product.price,
                quantity=item.quantity,
            )
            product.stock -= item.quantity
            product.save(update_fields=["stock"])

        # Clear cart
        cart.items.all().delete()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Order.objects.none()

        user = self.request.user
        if user.role == "ADMIN" or user.is_superuser:
            return Order.objects.prefetch_related("items").all()
        return Order.objects.prefetch_related("items").filter(user=user)


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Order.objects.none()

        user = self.request.user
        if user.role == "ADMIN" or user.is_superuser:
            return Order.objects.prefetch_related("items").all()
        return Order.objects.prefetch_related("items").filter(user=user)

@extend_schema(
    request=UpdateOrderStatusSerializer,
    responses={200: OrderSerializer},
)
class UpdateOrderStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsMerchantOrAdmin]

    def patch(self, request, pk):
        serializer = UpdateOrderStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        order.status = serializer.validated_data["status"]
        order.save(update_fields=["status", "updated_at"])
        return Response(OrderSerializer(order).data)
