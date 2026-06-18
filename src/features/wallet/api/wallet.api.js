import { apiFetch } from "../../../api/client";

export const getWallet = () => apiFetch("wallet");

export const topUp = (amount) =>
  apiFetch("wallet/topup", {
    method: "POST",
    body: JSON.stringify({ amount }),
  });

export const getTransactions = (page = 1, limit = 5) =>
  apiFetch(`wallet/transactions?page=${page}&limit=${limit}`);
