import { apiFetch } from "../../../api/client";
import type { Discount, DiscountInput, DiscountCheck } from "../../../types";

export const fetchDiscounts = (): Promise<Discount[]> => apiFetch("discounts/all");

export const fetchDiscountById = (id: string): Promise<Discount> => apiFetch(`discounts/${id}`);

export const createDiscount = (data: DiscountInput): Promise<Discount> =>
  apiFetch("discounts", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateDiscount = (id: string, data: Partial<DiscountInput>): Promise<Discount> =>
  apiFetch(`discounts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteDiscount = (id: string): Promise<void> =>
  apiFetch(`discounts/${id}`, { method: "DELETE" });

export const checkDiscount = (code: string): Promise<DiscountCheck> =>
  apiFetch(`discounts/check?code=${encodeURIComponent(code)}`);
