import { apiFetch } from "../../../api/client";
import type { ProductFilters, Product, ProductInput, PaginatedResponse } from "../../../types";

export const getAllProducts = ({
  page = 1,
  limit = 12,
  search = "",
  storeId,
  category,
  minPrice,
  maxPrice,
  sortBy,
  showHidden,
}: ProductFilters = {}): Promise<PaginatedResponse<Product>> => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.set("search", search);
  if (storeId) params.set("storeId", storeId);
  if (category) params.set("category", category);
  if (minPrice !== undefined) params.set("minPrice", String(minPrice));
  if (maxPrice !== undefined) params.set("maxPrice", String(maxPrice));
  if (sortBy) params.set("sortBy", sortBy);
  if (showHidden) params.set("showHidden", "true");
  return apiFetch(`products?${params.toString()}`);
};

export const getProductById = (id: string): Promise<Product> => apiFetch(`products/${id}`);

export const createProduct = (storeId: string, dto: ProductInput): Promise<Product> =>
  apiFetch(`products/${storeId}`, {
    method: "POST",
    body: JSON.stringify(dto),
  });

export const updateProduct = (productId: string, dto: ProductInput): Promise<Product> =>
  apiFetch(`products/${productId}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });

export const deleteProduct = (productId: string): Promise<void> =>
  apiFetch(`products/${productId}`, {
    method: "DELETE",
  });
