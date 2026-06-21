import { apiFetch } from "../../../api/client";
import type { PaginatedResponse, Wallet, WalletTransaction } from "../../../types";

export const getWallet = (): Promise<Wallet> => apiFetch("wallet");

export const topUp = (amount: number): Promise<Wallet> =>
  apiFetch("wallet/topup", {
    method: "POST",
    body: JSON.stringify({ amount }),
  });

export const getTransactions = (page = 1, limit = 5): Promise<PaginatedResponse<WalletTransaction>> =>
  apiFetch(`wallet/transactions?page=${page}&limit=${limit}`);
