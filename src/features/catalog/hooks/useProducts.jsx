import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllProducts } from "../api/catalog.api";

export const useProducts = (search = "") => {
  return useInfiniteQuery({
    queryKey: ["products", search],
    queryFn: ({ pageParam = 1 }) =>
      getAllProducts({ page: pageParam, limit: 12, search }),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) return lastPage.page + 1;
      return undefined;
    },
    initialPageParam: 1,
  });
};
