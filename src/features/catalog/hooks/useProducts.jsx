import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllProducts } from "../api/catalog.api";

export const useProducts = (search = "", category = "") => {
  return useInfiniteQuery({
    queryKey: ["products", search, category],
    queryFn: ({ pageParam = 1 }) =>
      getAllProducts({ page: pageParam, limit: 12, search, category }),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) return lastPage.page + 1;
      return undefined;
    },
    initialPageParam: 1,
  });
};
