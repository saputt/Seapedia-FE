import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllProducts } from "../api/catalog.api";

export const useProducts = ({ search = "", category = "", minPrice, maxPrice, sortBy } = {}) => {
  const queryKey = ["products", search, category, minPrice, maxPrice, sortBy];
  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) =>
      getAllProducts({ page: pageParam, limit: 12, search, category, minPrice, maxPrice, sortBy }),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) return lastPage.page + 1;
      return undefined;
    },
    initialPageParam: 1,
  });
};
