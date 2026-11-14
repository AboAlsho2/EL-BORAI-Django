from django.urls import path
from .views import CartView, AddToCartView, CartItemDetailView

urlpatterns = [
    path("", CartView.as_view(), name="cart"),
    path("items/", AddToCartView.as_view(), name="cart-add"),
    path("items/<int:product_id>/", CartItemDetailView.as_view(), name="cart-item"),
]
