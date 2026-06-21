import { apiFetch } from "../../../api/client";
import type { DriverJob } from "../../../types";

export const getAvailableJobs = (): Promise<DriverJob[]> => apiFetch("orders/available-jobs");

export const getMyDriverJobs = (): Promise<DriverJob[]> => apiFetch("orders/driver/my-jobs");

export const takeJob = (orderId: string): Promise<void> =>
  apiFetch(`orders/${orderId}/take-job`, { method: "PATCH" });

export const deliveryDone = (orderId: string): Promise<void> =>
  apiFetch(`orders/${orderId}/delivery-done`, { method: "PATCH" });

export const progressJob = (orderId: string, storeId: string): Promise<void> =>
  apiFetch(`orders/${orderId}/progress`, {
    method: "PATCH",
    body: JSON.stringify({ storeId }),
  });
