import { apiFetch } from "../../../api/client";

export const getAllProducts = ({ page = 1, limit = 12, search = "", storeId } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (search) params.set("search", search);
  if (storeId) params.set("storeId", storeId);
  return apiFetch(`products?${params.toString()}`);
};

export const getProductById = (id) => apiFetch(`products/${id}`);
