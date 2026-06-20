import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchDiscounts,
  createDiscount,
  deleteDiscount,
} from "../api/discount.api";

/**
 * Hook untuk mengelola diskon.
 * Menggunakan discount.api.js yang sudah dipisah.
 */
export const useDiscounts = () =>
  useQuery({
    queryKey: ["discounts"],
    queryFn: fetchDiscounts,
  });

export const useCreateDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDiscount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });
};

export const useDeleteDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDiscount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });
};
