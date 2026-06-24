import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../api/catalog.api";
import type { Product } from "../../../types";

export const useTopSellingProducts = (limit = 4) => {
  return useQuery({
    queryKey: ["topSellingProducts", limit],
    queryFn: async () => {
      const result = await getAllProducts({ page: 1, limit, sortBy: "newest" });
      return ((result as any).products ?? result.data ?? []) as Product[];
    },
  });
};
