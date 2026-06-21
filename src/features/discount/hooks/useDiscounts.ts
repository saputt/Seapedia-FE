import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchDiscounts,
  createDiscount,
  deleteDiscount,
} from "../api/discount.api";
import type { DiscountInput } from "../../../types";

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });
};
