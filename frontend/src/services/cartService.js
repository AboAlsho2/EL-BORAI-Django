import { apiGet, apiPost, apiPut, apiDelete } from "./api";

export async function getCart() {
  try {
    return await apiGet("/api/cart/");
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}

export function addCartItem(productId, quantity = 1) {
  return apiPost("/api/cart/items/", {
    product_id: productId,
    quantity,
  });
}

export function updateCartItem(productId, quantity) {
  return apiPut(`/api/cart/items/${productId}/`, { quantity });
}

export function removeCartItem(productId) {
  return apiDelete(`/api/cart/items/${productId}/`);
}

export function clearServerCart() {
  return apiDelete("/api/cart/");
}
