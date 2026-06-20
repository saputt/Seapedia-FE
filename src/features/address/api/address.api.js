import { apiFetch } from "../../../api/client";

/**
 * API module untuk alamat pengguna.
 * Dipisah dari order.api.js agar lebih terorganisir.
 */

export const fetchAddresses = () => apiFetch("address");

export const createAddress = (data) =>
  apiFetch("address", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateAddress = (id, data) =>
  apiFetch(`address/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteAddress = (id) =>
  apiFetch(`address/${id}`, { method: "DELETE" });

export const setDefaultAddress = (id) =>
  apiFetch(`address/${id}/default`, { method: "PATCH" });
