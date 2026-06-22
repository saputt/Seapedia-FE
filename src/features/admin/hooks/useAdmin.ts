import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminDashboard, getAdminUsers, getAdminStores, getAdminProducts,
  getAdminOrders, simulateOverdue, resetSimulation, getSimulationStatus,
  toggleStoreActive, toggleProductHidden,
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

export const useAdminOrders = (page = 1) =>
  useQuery({
    queryKey: ["admin", "orders", page],
    queryFn: () => getAdminOrders(page),
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
