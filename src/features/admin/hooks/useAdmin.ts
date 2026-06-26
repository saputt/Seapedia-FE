import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminDashboard, getAdminUsers, getAdminStores, getAdminProducts,
  getAdminOrders, simulateOverdue, resetSimulation, getSimulationStatus,
  toggleStoreActive, toggleProductHidden, getAdminDrivers, toggleDriverSuspend,
} from "../api/admin.api";

export const useAdminDashboard = () =>
  useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: getAdminDashboard,
  });

export const useAdminUsers = (page = 1) =>
  useQuery({
    queryKey: ["admin", "users", page],
    queryFn: () => getAdminUsers(page),
  });

export const useAdminStores = (page = 1) =>
  useQuery({
    queryKey: ["admin", "stores", page],
    queryFn: () => getAdminStores(page),
  });

export const useAdminProducts = (page = 1) =>
  useQuery({
    queryKey: ["admin", "products", page],
    queryFn: () => getAdminProducts(page),
  });

export const useAdminDrivers = (page = 1) =>
  useQuery({
    queryKey: ["admin", "drivers", page],
    queryFn: () => getAdminDrivers(page),
  });

export const useToggleDriverSuspend = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => toggleDriverSuspend(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "drivers"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
};

export const useAdminOrders = (page = 1, status?: string) =>
  useQuery({
    queryKey: ["admin", "orders", page, status],
    queryFn: () => getAdminOrders(page, 10, status),
  });

export const useToggleStoreActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => toggleStoreActive(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "stores"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
};

export const useToggleProductHidden = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleProductHidden(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
};

export const useSimulationStatus = () =>
  useQuery({
    queryKey: ["admin", "simulation-status"],
    queryFn: getSimulationStatus,
    refetchInterval: false,
  });

export const useSimulateOverdue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (daysToSkip: number = 1) => simulateOverdue(daysToSkip),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "simulation-status"] });
    },
  });
};

export const useResetSimulation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => resetSimulation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "simulation-status"] });
    },
  });
};
