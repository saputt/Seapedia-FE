import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../api/catalog.api";

export const useProductDetail = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};
