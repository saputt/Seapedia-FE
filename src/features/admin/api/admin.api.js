import { apiFetch } from "../../../api/client";

export const getAdminDashboard = () => apiFetch("admin/dashboard");

export const getAdminUsers = (page = 1, limit = 20) =>
  apiFetch(`admin/users?page=${page}&limit=${limit}`);

export const getAdminOrders = (page = 1, limit = 10) =>
  apiFetch(`orders/admin?page=${page}&limit=${limit}`);

export const simulateOverdue = (daysToSkip = 1) =>
  apiFetch("admin/simulation/overdue", {
    method: "POST",
    body: JSON.stringify({ daysToSkip }),
  });

export const resetSimulation = () =>
  apiFetch("admin/simulation/reset", { method: "POST" });

export const getSimulationStatus = () =>
  apiFetch("admin/simulation/status");
