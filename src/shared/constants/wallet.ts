import type { WalletTransactionType } from "../../types";

export const WALLET_TYPE_LABEL: Record<WalletTransactionType, string> = {
  TOP_UP: "Top Up",
  PAYMENT: "Pembayaran",
  REFUND: "Refund",
  SELLER_EARNING: "Pendapatan Toko",
  DRIVER_EARNING: "Pendapatan Driver",
};
