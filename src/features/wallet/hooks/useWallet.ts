import { useQuery, useMutation, useInfiniteQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { getWallet, getTransactions, topUp } from "../api/wallet.api";
import useAuthStore from "../../auth/store/authStore";
import { prependTransaction, restoreTransactions } from "../../../shared/utils/transaction";

const DEFAULT_LIMIT = 5;

export const useWallet = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ["wallet"],
    queryFn: getWallet,
    enabled: options?.enabled,
    refetchInterval: 60_000,
  });

export const useTransactions = (filters?: { startDate?: string; endDate?: string; type?: string }, limit = DEFAULT_LIMIT) => {
  const activeRole = useAuthStore((s) => s.activeRole);
  return useInfiniteQuery({
    queryKey: ["transactions", activeRole, filters, limit],
    queryFn: ({ pageParam = 1 }) => getTransactions(pageParam, limit, filters),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    placeholderData: keepPreviousData,
    staleTime: 30000,
    refetchInterval: 60_000,
  });
};

export const useTopUp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) => topUp(amount),
    onMutate: async (amount) => {
      await queryClient.cancelQueries({ queryKey: ["wallet"] });
      const prevWallet = queryClient.getQueryData(["wallet"]);
      if (prevWallet) {
        queryClient.setQueryData(["wallet"], (old: any) => ({
          ...old,
          balance: (old.balance || 0) + amount,
        }));
      }
      const prevTxns = prependTransaction(queryClient, {
        id: `opt-topup-${Date.now()}`,
        amount,
        type: "TOP_UP",
        description: "Top Up Dompet",
        createdAt: new Date().toISOString(),
      });
      return { prevWallet, prevTxns };
    },
    onError: (_err, _amount, context) => {
      if (context?.prevWallet) queryClient.setQueryData(["wallet"], context.prevWallet);
      if (context?.prevTxns) restoreTransactions(queryClient, context.prevTxns);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
