import { apiFetch } from "../../../api/client";

export const getStoreById = (storeId) => apiFetch(`stores/${storeId}`);
