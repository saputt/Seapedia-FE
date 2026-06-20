import { apiFetch } from "../../../api/client";

/**
 * API module untuk diskon/voucher.
 * Digunakan di useDiscounts hook dan AdminDiscountsPage.
 */

export const fetchDiscounts = () => apiFetch("discounts/all");

export const fetchDiscountById = (id) => apiFetch(`discounts/${id}`);

export const createDiscount = (data) =>
  apiFetch("discounts", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateDiscount = (id, data) =>
  apiFetch(`discounts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteDiscount = (id) =>
  apiFetch(`discounts/${id}`, { method: "DELETE" });

export const checkDiscount = (code) =>
  apiFetch(`discounts/check?code=${encodeURIComponent(code)}`);
