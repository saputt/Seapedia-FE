import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminDashboard, getAdminUsers, getAdminOrders, simulateOverdue } from "../api/admin.api";

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

export const useSimulateOverdue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dayToSkip) => simulateOverdue(dayToSkip),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });
};
