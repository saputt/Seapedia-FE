import { apiFetch } from "../../../api/client";

export const getAvailableJobs = () => apiFetch("orders/available-jobs");

export const getMyDriverJobs = () => apiFetch("orders/driver/my-jobs");

export const takeJob = (orderId) =>
  apiFetch(`orders/${orderId}/take-job`, { method: "PATCH" });

export const progressJob = (orderId, storeId) =>
  apiFetch(`orders/${orderId}/progress`, {
    method: "PATCH",
    body: JSON.stringify({ storeId }),
  });
