from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Cart, CartItem
from .serializers import (
    CartSerializer,
    AddToCartSerializer,
    UpdateCartItemSerializer,
)
from products.models import Product


def get_or_create_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart


class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart = get_or_create_cart(request.user)
        return Response(CartSerializer(cart).data)

    def delete(self, request):
        """Clear cart"""
        cart = get_or_create_cart(request.user)
        cart.items.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AddToCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = Product.objects.get(id=serializer.validated_data["product_id"])
        quantity = serializer.validated_data["quantity"]
        cart = get_or_create_cart(request.user)

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={"quantity": quantity},
        )
        if not created:
            new_qty = item.quantity + quantity
            if product.stock < new_qty:
                return Response(
                    {"detail": f"Only {product.stock} items available."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            item.quantity = new_qty
            item.save()

        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)


class CartItemDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, product_id):
        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart = get_or_create_cart(request.user)
        try:
            item = cart.items.get(product_id=product_id)
        except CartItem.DoesNotExist:
            return Response({"detail": "Item not in cart."}, status=status.HTTP_404_NOT_FOUND)

        product = item.product
        qty = serializer.validated_data["quantity"]
        if product.stock < qty:
            return Response(
                {"detail": f"Only {product.stock} items available."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        item.quantity = qty
        item.save()
        return Response(CartSerializer(cart).data)

    def delete(self, request, product_id):
        cart = get_or_create_cart(request.user)
        deleted, _ = cart.items.filter(product_id=product_id).delete()
        if not deleted:
            return Response({"detail": "Item not in cart."}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)
