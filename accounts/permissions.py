from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.role == "ADMIN" or request.user.is_superuser)
        )


class IsMerchant(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == "MERCHANT"
        )


class IsCustomer(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == "CUSTOMER"
        )


class IsMerchantOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in ("MERCHANT", "ADMIN")
        )


class IsOwnerOrAdmin(BasePermission):
    """Object-level: owner or admin."""

    def has_object_permission(self, request, view, obj):
        if request.user.role == "ADMIN" or request.user.is_superuser:
            return True
        # Supports objects with .user or .merchant or the user itself
        if hasattr(obj, "user"):
            return obj.user_id == request.user.id
        if hasattr(obj, "merchant"):
            return obj.merchant_id == request.user.id
        if hasattr(obj, "merchant_id"):
            return obj.merchant_id == request.user.id
        return obj == request.user
