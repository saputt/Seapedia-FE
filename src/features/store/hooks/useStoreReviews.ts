import { useQuery } from "@tanstack/react-query";
import { getStoreReviews } from "../api/store.api";

export const useStoreReviews = (storeId: string) =>
  useQuery({
    queryKey: ["store-reviews", storeId],
    queryFn: () => getStoreReviews(storeId),
    enabled: !!storeId,
  });
