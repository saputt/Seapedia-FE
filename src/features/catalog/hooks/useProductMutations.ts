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
    onMutate: async (productId) => {
      const queryKeys = queryClient.getQueryCache().findAll({ queryKey: ["sellerProducts"] });
      const previousStates = queryKeys.map((q) => ({ queryKey: q.queryKey, data: q.state.data }));
      await queryClient.cancelQueries({ queryKey: ["sellerProducts"] });
      queryKeys.forEach((q) => {
        queryClient.setQueryData(q.queryKey, (old: any) => {
          if (!old) return old;
          const pages = old.pages
            ? { ...old, pages: old.pages.map((page: any) => ({
                ...page,
                products: page.products?.filter((p: any) => p.id !== productId),
                data: page.data?.filter((p: any) => p.id !== productId),
              }))}
            : Array.isArray(old)
              ? old.filter((p: any) => p.id !== productId)
              : old;
          return pages;
        });
      });
      return { previousStates };
    },
    onError: (_err, _productId, context) => {
      if (context?.previousStates) {
        context.previousStates.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerProducts"] });
    },
  });
};
