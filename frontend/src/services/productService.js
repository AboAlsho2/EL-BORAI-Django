import { apiGet, apiPost, apiPut, apiDelete } from "./api";

export function getProducts(params = "") {
  const q = params ? `?${params}` : "";
  return apiGet(`/api/products/${q}`);
}

export function getProductById(id) {
  return apiGet(`/api/products/${id}/`);
}

export function createProduct(product) {
  return apiPost("/api/products/", product);
}

export function updateProduct(id, product) {
  return apiPut(`/api/products/${id}/`, product);
}

export function deleteProduct(id) {
  return apiDelete(`/api/products/${id}/`);
}

export async function getCategories() {
  const data = await apiGet("/api/categories/?page=1");
  let list = Array.isArray(data) ? data : data.results || [];
  let next = data && !Array.isArray(data) ? data.next : null;
  let page = 2;
  while (next) {
    const more = await apiGet(`/api/categories/?page=${page++}`);
    list = list.concat(more.results || []);
    next = more.next;
  }
  return list;
}

export function createCategory(name) {
  return apiPost("/api/categories/", { name });
}
