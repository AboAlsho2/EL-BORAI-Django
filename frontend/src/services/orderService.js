import { apiGet, apiPost, apiPatch } from "./api";

export function createOrder(shippingAddress = "") {
  return apiPost("/api/orders/create/", {
    shipping_address: shippingAddress,
  });
}

export function getOrders(page = 1) {
  return apiGet(`/api/orders/?page=${page}`);
}

export function getOrderById(id) {
  return apiGet(`/api/orders/${id}/`);
}

export function updateOrderStatus(id, status) {
  return apiPatch(`/api/orders/${id}/status/`, { status });
}
