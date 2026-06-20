import { apiFetch } from "../../../api/client";

export const getAllProducts = ({ page = 1, limit = 12, search = "", storeId, category, minPrice, maxPrice, sortBy } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (search) params.set("search", search);
  if (storeId) params.set("storeId", storeId);
  if (category) params.set("category", category);
  if (minPrice) params.set("minPrice", minPrice);
  if (maxPrice) params.set("maxPrice", maxPrice);
  if (sortBy) params.set("sortBy", sortBy);
  return apiFetch(`products?${params.toString()}`);
};

export const getProductById = (id) => apiFetch(`products/${id}`);

export const createProduct = (storeId, dto) =>
  apiFetch(`products/${storeId}`, {
    method: "POST",
    body: JSON.stringify(dto),
  });

export const updateProduct = (productId, dto) =>
  apiFetch(`products/${productId}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });

export const deleteProduct = (productId) =>
  apiFetch(`products/${productId}`, {
    method: "DELETE",
  });
