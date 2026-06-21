import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAvailableJobs, getMyDriverJobs, takeJob, progressJob, deliveryDone } from "../api/driver.api";

export const useAvailableJobs = () =>
  useQuery({
    queryKey: ["availableJobs"],
    queryFn: getAvailableJobs,
  });

export const useMyDriverJobs = () =>
  useQuery({
    queryKey: ["myDriverJobs"],
    queryFn: getMyDriverJobs,
  });

export const useTakeJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => takeJob(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availableJobs"] });
      queryClient.invalidateQueries({ queryKey: ["myDriverJobs"] });
    },
  });
};

export const useDeliveryDone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => deliveryDone(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myDriverJobs"] });
    },
  });
};

export const useProgressJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, storeId }: { orderId: string; storeId: string }) =>
      progressJob(orderId, storeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myDriverJobs"] });
    },
  });
};
