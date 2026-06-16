import { apiFetch } from "../../../api/client";

export const getWallet = () => apiFetch("wallet");

export const topUp = (amount) =>
  apiFetch("wallet/topup", {
    method: "POST",
    body: JSON.stringify({ amount }),
  });

export const getTransactions = () => apiFetch("wallet/transactions");
