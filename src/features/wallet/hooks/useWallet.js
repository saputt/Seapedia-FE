import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getWallet, getTransactions, topUp } from "../api/wallet.api";
import useAuthStore from "../../auth/store/authStore";

const LIMIT = 5;

export const useWallet = () =>
  useQuery({
    queryKey: ["wallet"],
    queryFn: getWallet,
  });

export const useTransactions = () => {
  const activeRole = useAuthStore((s) => s.activeRole);
  return useInfiniteQuery({
    queryKey: ["transactions", activeRole],
    queryFn: ({ pageParam = 1 }) => getTransactions(pageParam, LIMIT),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });
};

export const useTopUp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amount) => topUp(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
