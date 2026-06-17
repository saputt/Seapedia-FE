import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllProducts } from "../../catalog/api/catalog.api";

export const useStoreProducts = (storeId, search = "") =>
  useInfiniteQuery({
    queryKey: ["store-products", storeId, search],
    queryFn: ({ pageParam = 1 }) =>
      getAllProducts({ page: pageParam, limit: 12, search, storeId }),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) return lastPage.page + 1;
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!storeId,
  });
