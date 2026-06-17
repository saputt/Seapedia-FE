import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStore } from "../api/store.api";

export const useUpdateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, data }) => updateStore(storeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myStore"] });
    },
  });
};
