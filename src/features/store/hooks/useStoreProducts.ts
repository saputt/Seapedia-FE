import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllProducts } from "../../catalog/api/catalog.api";

export const useStoreProducts = (storeId: string, search = "", sortBy = "newest") =>
  useInfiniteQuery({
    queryKey: ["store-products", storeId, search, sortBy],
    queryFn: ({ pageParam = 1 }) =>
      getAllProducts({ page: pageParam, limit: 12, search, storeId, sortBy }),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) return lastPage.page + 1;
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!storeId,
  });
