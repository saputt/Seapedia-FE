import { apiFetch } from "../../../api/client";
import type { PaginatedResponse, Wallet, WalletTransaction } from "../../../types";

export const getWallet = (): Promise<Wallet> => apiFetch("wallet");

export const topUp = (amount: number): Promise<Wallet> =>
  apiFetch("wallet/topup", {
    method: "POST",
    body: JSON.stringify({ amount }),
  });

export const getTransactions = (
  page = 1,
  limit = 5,
  filters?: { startDate?: string; endDate?: string; type?: string }
): Promise<PaginatedResponse<WalletTransaction>> => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (filters?.startDate) params.set("startDate", filters.startDate);
  if (filters?.endDate) params.set("endDate", filters.endDate);
  if (filters?.type) params.set("type", filters.type);
  return apiFetch(`wallet/transactions?${params.toString()}`);
};
