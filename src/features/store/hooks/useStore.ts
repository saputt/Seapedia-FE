import { useQuery } from "@tanstack/react-query";
import { getStoreById } from "../api/store.api";

export const useStore = (storeId: string) =>
  useQuery({
    queryKey: ["store", storeId],
    queryFn: () => getStoreById(storeId),
    enabled: !!storeId,
  });
