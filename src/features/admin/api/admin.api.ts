import { apiFetch } from "../../../api/client";
import type { AdminDashboard, Order, PaginatedResponse, SimulationStatus, UserProfile } from "../../../types";

export const getAdminDashboard = (): Promise<AdminDashboard> => apiFetch("admin/dashboard");

export const getAdminUsers = (page = 1, limit = 20): Promise<PaginatedResponse<UserProfile>> =>
  apiFetch(`admin/users?page=${page}&limit=${limit}`);

export const getAdminOrders = (page = 1, limit = 10): Promise<PaginatedResponse<Order>> =>
  apiFetch(`orders/admin?page=${page}&limit=${limit}`);

export const simulateOverdue = (daysToSkip = 1): Promise<SimulationStatus> =>
  apiFetch("admin/simulation/overdue", {
    method: "POST",
    body: JSON.stringify({ daysToSkip }),
  });

export const resetSimulation = (): Promise<SimulationStatus> =>
  apiFetch("admin/simulation/reset", { method: "POST" });

export const getSimulationStatus = (): Promise<SimulationStatus> =>
  apiFetch("admin/simulation/status");
