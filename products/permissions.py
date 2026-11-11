from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsMerchantOwnerOrReadOnly(BasePermission):
    """
    Read: anyone
    Write: only merchant owner of the product (or admin)
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in ("MERCHANT", "ADMIN")
        )

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        if request.user.role == "ADMIN" or request.user.is_superuser:
            return True
        return obj.merchant_id == request.user.id
