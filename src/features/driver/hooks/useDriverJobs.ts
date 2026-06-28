import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAvailableJobs, getMyDriverJobs, takeJob, progressJob, deliveryDone } from "../api/driver.api";
import { createDriverReview } from "../api/driverReview.api";

export const useAvailableJobs = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ["availableJobs"],
    queryFn: getAvailableJobs,
    refetchInterval: 15_000,
    enabled: options?.enabled ?? true,
  });

export const useMyDriverJobs = () =>
  useQuery({
    queryKey: ["myDriverJobs"],
    queryFn: getMyDriverJobs,
    refetchInterval: 15_000,
  });

export const useTakeJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => takeJob(orderId),
    onMutate: async (orderId) => {
      await queryClient.cancelQueries({ queryKey: ["availableJobs"] });
      await queryClient.cancelQueries({ queryKey: ["myDriverJobs"] });
      const prevAvailable = queryClient.getQueryData(["availableJobs"]);
      const prevMyJobs = queryClient.getQueryData(["myDriverJobs"]);
      const takenJob = Array.isArray(prevAvailable)
        ? (prevAvailable as any[]).find((j: any) => j.id === orderId)
        : null;
      queryClient.setQueryData(["availableJobs"], (old: any) => {
        if (!old) return old;
        if (Array.isArray(old)) return old.filter((j: any) => j.id !== orderId);
        return old;
      });
      if (takenJob) {
        queryClient.setQueryData(["myDriverJobs"], (old: any) => {
          if (!old) return [takenJob];
          if (Array.isArray(old)) return [takenJob, ...old];
          return old;
        });
      }
      return { prevAvailable, prevMyJobs };
    },
    onError: (_err, _id, context) => {
      if (context?.prevAvailable) queryClient.setQueryData(["availableJobs"], context.prevAvailable);
      if (context?.prevMyJobs) queryClient.setQueryData(["myDriverJobs"], context.prevMyJobs);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["availableJobs"] });
      queryClient.invalidateQueries({ queryKey: ["myDriverJobs"] });
    },
  });
};

export const useDeliveryDone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => deliveryDone(orderId),
    onMutate: async (orderId) => {
      await queryClient.cancelQueries({ queryKey: ["myDriverJobs"] });
      const previous = queryClient.getQueryData(["myDriverJobs"]);
      queryClient.setQueryData(["myDriverJobs"], (old: any) => {
        if (!Array.isArray(old)) return old;
        return old.map((j: any) =>
          j.id === orderId ? { ...j, status: "DELIVERED" } : j
        );
      });
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) queryClient.setQueryData(["myDriverJobs"], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["myDriverJobs"] });
    },
  });
};

export const useCreateDriverReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, ...data }: { orderId: string; rating: number; comment: string }) =>
      createDriverReview(orderId, data),
    onSuccess: (_data, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ["buyer-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },
  });
};

export const useProgressJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, storeId }: { orderId: string; storeId: string }) =>
      progressJob(orderId, storeId),
    onMutate: async ({ orderId }) => {
      await queryClient.cancelQueries({ queryKey: ["myDriverJobs"] });
      const previous = queryClient.getQueryData(["myDriverJobs"]);
      queryClient.setQueryData(["myDriverJobs"], (old: any) => {
        if (!Array.isArray(old)) return old;
        return old.map((j: any) =>
          j.id === orderId ? { ...j, status: "IN_PROGRESS" } : j
        );
      });
      return { previous };
    },
    onError: (_err, _params, context) => {
      if (context?.previous) queryClient.setQueryData(["myDriverJobs"], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["myDriverJobs"] });
    },
  });
};
