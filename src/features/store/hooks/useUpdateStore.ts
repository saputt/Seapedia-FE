import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStore } from "../api/store.api";
import type { StoreInput } from "../../../types";

export const useUpdateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, data }: { storeId: string; data: StoreInput }) =>
      updateStore(storeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myStore"] });
    },
  });
};
