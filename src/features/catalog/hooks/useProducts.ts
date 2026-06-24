import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllProducts } from "../api/catalog.api";
import type { ProductCategory, ProductFilters } from "../../../types";

export const useProducts = ({
  search = "",
  category = "" as ProductCategory,
  minPrice,
  maxPrice,
  sortBy,
  limit = 12,
}: ProductFilters & { limit?: number } = {}) => {
  const queryKey = ["products", search, category, minPrice, maxPrice, sortBy, limit];
  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) =>
      getAllProducts({ page: pageParam, limit, search, category, minPrice, maxPrice, sortBy }),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) return lastPage.page + 1;
      return undefined;
    },
    initialPageParam: 1,
  });
};
