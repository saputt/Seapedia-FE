import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAddress, updateAddress, deleteAddress, setDefaultAddress } from "../api/address.api";
import type { Address, AddressInput } from "../../../types";

const ADDRESSES_QUERY_KEY = ["addresses"];

export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddressInput) => createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddressInput }) => updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
  });
};

export const useSaveAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id?: string; data: AddressInput }) => {
      if (id) return updateAddress(id, data);
      return createAddress(data);
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ADDRESSES_QUERY_KEY });
      const previous = queryClient.getQueryData<Address[]>(ADDRESSES_QUERY_KEY);

      if (id) {
        queryClient.setQueryData<Address[]>(ADDRESSES_QUERY_KEY, (old) =>
          old ? old.map((a) => a.id === id ? { ...a, ...data, label: data.label } : a) : []
        );
      } else {
        const newAddr = {
          id: `opt-${Date.now()}`,
          label: data.label,
          completeAddress: (data as any).completeAddress || data.fullAddress || '',
          lastUsed: false,
          userId: '',
          createdAt: new Date().toISOString(),
        } as Address;
        queryClient.setQueryData<Address[]>(ADDRESSES_QUERY_KEY, (old) =>
          old ? [newAddr, ...old] : [newAddr]
        );
      }

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(ADDRESSES_QUERY_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ADDRESSES_QUERY_KEY });
      const previous = queryClient.getQueryData<Address[]>(ADDRESSES_QUERY_KEY);
      queryClient.setQueryData<Address[]>(ADDRESSES_QUERY_KEY, (old) =>
        old ? old.filter((a) => a.id !== id) : []
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(ADDRESSES_QUERY_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
  });
};

export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => setDefaultAddress(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ADDRESSES_QUERY_KEY });
      const previous = queryClient.getQueryData<Address[]>(ADDRESSES_QUERY_KEY);
      queryClient.setQueryData<Address[]>(ADDRESSES_QUERY_KEY, (old) =>
        old
          ? old.map((a) => ({ ...a, lastUsed: a.id === id }))
          : []
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(ADDRESSES_QUERY_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
  });
};
