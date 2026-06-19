import { apiFetch } from "../../../api/client";

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

export const fetchAddresses = () => apiFetch("address");

export const createAddress = (data) =>
  apiFetch("address", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteAddress = (id) =>
  apiFetch(`address/${id}`, { method: "DELETE" });

export const updateAddress = (id, data) =>
  apiFetch(`address/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const setDefaultAddress = (id) =>
  apiFetch(`address/${id}/default`, { method: "PATCH" });

export const checkDiscount = (code) =>
  apiFetch(`discounts/check?code=${encodeURIComponent(code)}`);

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
