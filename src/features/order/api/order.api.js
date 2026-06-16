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

export const checkDiscount = (code) =>
  apiFetch(`discounts/check?code=${encodeURIComponent(code)}`);

export const getBuyerOrders = () => apiFetch("orders/buyer");

export const getOrderById = (orderId) => apiFetch(`orders/${orderId}`);
