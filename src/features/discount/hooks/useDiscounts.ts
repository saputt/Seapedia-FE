import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchDiscounts,
  createDiscount,
  deleteDiscount,
  checkDiscount,
} from "../api/discount.api";
import type { DiscountInput, DiscountCheck } from "../../../types";

export const useDiscounts = () =>
  useQuery({
    queryKey: ["discounts"],
    queryFn: fetchDiscounts,
  });

export const useCreateDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DiscountInput) => createDiscount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });
};

export const useDeleteDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDiscount(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["discounts"] });
      const previous = queryClient.getQueryData(["discounts"]);
      queryClient.setQueryData(["discounts"], (old: any) => {
        if (!old) return old;
        if (Array.isArray(old)) return old.filter((d: any) => d.id !== id);
        if (old.pages) return { ...old, pages: old.pages.map((p: any) => ({ ...p, data: p.data?.filter((d: any) => d.id !== id) })) };
        return old;
      });
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["discounts"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });
};

export const useCheckDiscount = (code: string, enabled = true) =>
  useQuery({
    queryKey: ["discount", "check", code],
    queryFn: () => checkDiscount(code),
    enabled: enabled && !!code?.trim(),
    retry: false,
  });
