import { useQuery, useMutation, useInfiniteQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { getWallet, getTransactions, topUp } from "../api/wallet.api";
import useAuthStore from "../../auth/store/authStore";
import type { WalletTransaction } from "../../types";

const DEFAULT_LIMIT = 5;

const prependTransaction = (queryClient: ReturnType<typeof useQueryClient>, tx: WalletTransaction) => {
  const all = queryClient.getQueriesData({ queryKey: ["transactions"] });
  const prev: Record<string, unknown> = {};
  all.forEach(([key, old]) => {
    if (!old) return;
    const k = JSON.stringify(key);
    prev[k] = old;
    queryClient.setQueryData(key, (data: any) => {
      if (!data?.pages?.length) return data;
      const [first, ...rest] = data.pages;
      return { ...data, pages: [{ ...first, data: [tx, ...first.data] }, ...rest] };
    });
  });
  return prev;
};

const restoreTransactions = (queryClient: ReturnType<typeof useQueryClient>, prev: Record<string, unknown>) => {
  Object.entries(prev).forEach(([key, data]) => queryClient.setQueryData(JSON.parse(key), data));
};

export const useWallet = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ["wallet"],
    queryFn: getWallet,
    enabled: options?.enabled,
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
