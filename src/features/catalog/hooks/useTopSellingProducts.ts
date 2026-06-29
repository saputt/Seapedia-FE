import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../api/catalog.api";

export const useTopSellingProducts = (limit = 4) => {
  return useQuery({
    queryKey: ["topSellingProducts", limit],
    queryFn: () => getAllProducts({ page: 1, limit, sortBy: "best_selling" }),
    select: (data) => data.products ?? data.data ?? [],
  });
};
