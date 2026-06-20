import { apiFetch } from "../../../api/client";

/**
 * API module untuk pesanan.
 * Address functions sudah dipindah ke address.api.js.
 * Discount functions sudah dipindah ke discount.api.js.
 */

export const getOrderSummary = (data) =>
  apiFetch("orders/summary", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const checkoutOrder = (data) =>
  apiFetch("orders/checkout", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getBuyerOrders = () => apiFetch("orders/buyer");

export const getSellerOrders = (params = {}) => {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.orderBy) query.set("orderBy", params.orderBy);
  const qs = query.toString();
  return apiFetch(`orders/seller${qs ? `?${qs}` : ""}`);
};

export const getOrderById = (orderId) => apiFetch(`orders/${orderId}`);

export const cancelOrder = (orderId) =>
  apiFetch(`orders/${orderId}/cancel`, { method: "PATCH" });

export const updateOrderStatus = (orderId, storeId) =>
  apiFetch(`orders/${orderId}/progress`, {
    method: "PATCH",
    body: JSON.stringify({ storeId }),
  });
