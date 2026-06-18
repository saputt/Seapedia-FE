import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminDashboard, getAdminUsers, getAdminOrders, simulateOverdue, resetSimulation, getSimulationStatus } from "../api/admin.api";

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

export const useAdminOrders = (page = 1) =>
  useQuery({
    queryKey: ["admin", "orders", page],
    queryFn: () => getAdminOrders(page),
  });

export const useSimulationStatus = () =>
  useQuery({
    queryKey: ["admin", "simulation-status"],
    queryFn: getSimulationStatus,
    refetchInterval: false,
  });

export const useSimulateOverdue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (daysToSkip = 1) => simulateOverdue(daysToSkip),
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
