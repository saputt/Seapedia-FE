import { apiFetch } from "../../../api/client";
import type { Store, StoreInput, StoreReviewsResponse } from "../../../types";

export const getStoreById = (storeId: string): Promise<Store> => apiFetch(`stores/${storeId}`);

export const getMyStore = (): Promise<Store> => apiFetch("stores/my");

export const getStoreReviews = (storeId: string): Promise<StoreReviewsResponse> =>
  apiFetch(`stores/${storeId}/reviews`);

export const createStore = (dto: StoreInput): Promise<Store> =>
  apiFetch("stores", {
    method: "POST",
    body: JSON.stringify(dto),
  });

export const updateStore = (storeId: string, dto: StoreInput): Promise<Store> =>
  apiFetch(`stores/${storeId}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
