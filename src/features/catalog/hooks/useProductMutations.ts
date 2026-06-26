import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllProducts, createProduct, updateProduct, deleteProduct } from "../api/catalog.api";

export const useSellerProducts = (storeId: string, search = "") =>
  useQuery({
    queryKey: ["sellerProducts", storeId, search],
    queryFn: () => getAllProducts({ storeId, limit: 100, search, showHidden: true }),
    enabled: !!storeId,
  });

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ storeId, data }: { storeId: string; data: any }) =>
      createProduct(storeId, data),
    onMutate: async ({ storeId, data }) => {
      await queryClient.cancelQueries({ queryKey: ["sellerProducts"] });
      const previous = queryClient.getQueriesData({ queryKey: ["sellerProducts"] });
      const tempProduct = { id: `opt-${Date.now()}`, ...data, storeId };
      queryClient.setQueriesData({ queryKey: ["sellerProducts"] }, (old: any) => {
        if (!old) return old;
        if (Array.isArray(old)) return [tempProduct, ...old];
        if (old.pages) {
          const pages = old.pages.map((p: any, i: number) =>
            i === 0 ? { ...p, data: [tempProduct, ...(p.data || [])], products: [tempProduct, ...(p.products || [])] } : p
          );
          return { ...old, pages };
        }
        return old;
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        context.previous.forEach(([key, data]: [any, any]) => queryClient.setQueryData(key, data));
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerProducts"] });
    },
  });
};

export const useUpdateProduct = (productId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => updateProduct(productId, data),
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
