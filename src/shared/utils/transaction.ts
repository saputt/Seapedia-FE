import { useQueryClient } from "@tanstack/react-query";
import type { WalletTransaction } from "../../types";

export const prependTransaction = (queryClient: ReturnType<typeof useQueryClient>, tx: WalletTransaction) => {
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

export const restoreTransactions = (queryClient: ReturnType<typeof useQueryClient>, prev: Record<string, unknown>) => {
  Object.entries(prev).forEach(([key, data]) => queryClient.setQueryData(JSON.parse(key), data));
};
