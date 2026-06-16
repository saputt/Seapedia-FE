import { apiFetch } from "../../../api/client";

export const getAllProducts = ({ page = 1, limit = 12, search = "" } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (search) params.set("search", search);
  return apiFetch(`products?${params.toString()}`);
};

export const getProductById = (id) => apiFetch(`products/${id}`);
