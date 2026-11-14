import { useCallback, useEffect, useRef, useState } from "react";
import { CartContext } from "./cart-context";
import useAuth from "./useAuth";
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearServerCart,
} from "../services/cartService";

function mapCartItems(cart) {
  return (cart?.items ?? []).map((item) => ({
    id: item.product,
    name: item.product_name,
    price: Number(item.product_price),
    quantity: item.quantity,
  }));
}

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const requestId = useRef(0);

  const loadCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      setError("");
      setIsLoading(false);
      return;
    }

    const currentRequestId = ++requestId.current;
    setIsLoading(true);
    setError("");

    try {
      const cart = await getCart();
      if (currentRequestId !== requestId.current) return;
      setItems(mapCartItems(cart));
    } catch (err) {
      if (currentRequestId !== requestId.current) return;
      setError(err.message || "فشل تحميل الشكارة.");
    } finally {
      if (currentRequestId === requestId.current) {
        setIsLoading(false);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addItem = useCallback(
    async (product) => {
      if (!isAuthenticated) {
        setError("سجّل دخول عشان تحط في الشكارة.");
        return false;
      }
      setError("");
      try {
        await addCartItem(product.id, product.quantity ?? 1);
        await loadCart();
        return true;
      } catch (err) {
        setError(err.message || "فشل إضافة المنتج.");
        return false;
      }
    },
    [isAuthenticated, loadCart]
  );

  const removeItem = useCallback(
    async (productId) => {
      setError("");
      try {
        await removeCartItem(productId);
        await loadCart();
      } catch (err) {
        setError(err.message || "فشل حذف المنتج.");
      }
    },
    [loadCart]
  );

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      if (quantity <= 0) {
        await removeItem(productId);
        return;
      }
      setError("");
      try {
        await updateCartItem(productId, quantity);
        await loadCart();
      } catch (err) {
        setError(err.message || "فشل تعديل الكمية.");
      }
    },
    [loadCart, removeItem]
  );

  const clearCart = useCallback(async () => {
    setError("");
    try {
      await clearServerCart();
      setItems([]);
    } catch (err) {
      setError(err.message || "فشل تفريغ الشكارة.");
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isLoading,
        error,
        refreshCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
