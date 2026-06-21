import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllProducts, createProduct, updateProduct, deleteProduct } from "../api/catalog.api";
import { apiFetch } from "../../../api/client";

export const useSellerProducts = (storeId: string, search = "") =>
  useQuery({
    queryKey: ["sellerProducts", storeId, search],
    queryFn: () => getAllProducts({ storeId, limit: 100, search }),
    enabled: !!storeId,
  });

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ storeId, data }: { storeId: string; data: any }) => {
      if (data instanceof FormData) {
        return apiFetch(`products/${storeId}`, {
          method: "POST",
          body: data,
        });
      }
      return createProduct(storeId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerProducts"] });
    },
  });
};

export const useUpdateProduct = (productId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      if (data instanceof FormData) {
        return apiFetch(`products/${productId}`, {
          method: "PUT",
          body: data,
        });
      }
      return updateProduct(productId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerProducts"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerProducts"] });
    },
  });
};
