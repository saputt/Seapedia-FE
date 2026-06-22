import { useQuery } from "@tanstack/react-query";
import { getFeaturedProducts } from "../api/landing.api";

export const useFeaturedProducts = (limit = 6) => {
  return useQuery({
    queryKey: ["featured-products", limit],
    queryFn: () => getFeaturedProducts(limit),
  });
};
