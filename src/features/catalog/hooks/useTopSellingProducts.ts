import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../api/catalog.api";
import type { Product } from "../../../types";

export const useTopSellingProducts = (limit = 4) => {
  return useQuery({
    queryKey: ["topSellingProducts", limit],
    queryFn: async () => {
      const result = await getAllProducts({ page: 1, limit: 8, sortBy: "newest" });
      const products = ((result as any).products ?? result.data ?? []) as Product[];
      return products
        .sort((a, b) => (b.soldCount ?? 0) - (a.soldCount ?? 0))
        .slice(0, limit);
    },
  });
};
