import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWallet, getTransactions, topUp } from "../api/wallet.api";

export const useWallet = () =>
  useQuery({
    queryKey: ["wallet"],
    queryFn: getWallet,
  });

export const useTransactions = () =>
  useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });

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
