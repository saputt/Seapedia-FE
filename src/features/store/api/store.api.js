import { apiFetch } from "../../../api/client";

export const getStoreById = (storeId) => apiFetch(`stores/${storeId}`);

export const getMyStore = () => apiFetch("stores/my");

export const createStore = (dto) =>
  apiFetch("stores", {
    method: "POST",
    body: JSON.stringify(dto),
  });
