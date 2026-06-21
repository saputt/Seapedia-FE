import React from "react";
import ErrorState from "../../../shared/components/ui/ErrorState";
import Spinner from "../../../shared/components/ui/Spinner";
import useInfiniteScroll from "../../../shared/hooks/useInfiniteScroll";
import { useWallet, useTransactions } from "../../../features/wallet/hooks/useWallet";
import { WALLET_TYPE_LABEL } from "../../../shared/constants/wallet";

const IncomeHistoryPage: React.FC = () => {
  const { data: wallet, isLoading: walletLoading, error: walletError } = useWallet() as any;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: txLoading, error: txError } = useTransactions() as any;

  const loading = walletLoading || txLoading;
  const error = walletError || txError;
  const transactions = data?.pages.flatMap((p: any) => p.data) ?? [];

  const incomeTx = transactions.filter((tx: any) => tx.type === "SELLER_EARNING");
  const totalIncome = incomeTx.reduce((sum: number, tx: any) => sum + tx.amount, 0);

  const sentinelRef = useInfiniteScroll(fetchNextPage, {
    enabled: hasNextPage && !isFetchingNextPage,
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">Riwayat Pemasukkan</h1>
        <p className="text-sm text-text-muted mb-6">Riwayat pendapatan dari penjualan</p>
        <ErrorState message="Gagal memuat data pemasukkan." onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-text-primary mb-1">Riwayat Pemasukkan</h1>
      <p className="text-sm text-text-muted mb-6">Riwayat pendapatan dari penjualan</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="card">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
            Saldo Dompet
          </p>
          <p className="text-3xl font-bold text-brand-deep">
            Rp{wallet?.balance?.toLocaleString("id-ID") ?? 0}
          </p>
        </div>
        <div className="card">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
            Total Pemasukkan
          </p>
          <p className="text-3xl font-bold text-success">
            Rp{totalIncome.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-sm font-bold text-text-primary mb-3">Riwayat Transaksi</h2>
        {transactions.length === 0 ? (
          <p className="text-sm text-text-secondary text-center py-6">Belum ada transaksi.</p>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx: any) => (
              <div
                key={tx.id}
                className="flex items-center justify-between px-3 py-2 rounded hover:bg-brand-subtle transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {WALLET_TYPE_LABEL[tx.type] || tx.type}
                  </p>
                  <p className="text-xs text-text-muted">
                    {new Date(tx.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <p
                  className={`text-sm font-semibold ${
                    tx.type === "SELLER_EARNING"
                      ? "text-success"
                      : tx.type === "PAYMENT"
                        ? "text-danger"
                        : "text-text-primary"
                  }`}
                >
                  {tx.type === "SELLER_EARNING" || tx.type === "TOP_UP" || tx.type === "REFUND"
                    ? `+Rp${tx.amount.toLocaleString("id-ID")}`
                    : `-Rp${tx.amount.toLocaleString("id-ID")}`}
                </p>
              </div>
            ))}
            {isFetchingNextPage && (
              <div className="flex justify-center py-3">
                <Spinner />
              </div>
            )}
            {hasNextPage && !isFetchingNextPage && (
              <div ref={sentinelRef} className="h-4" />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default IncomeHistoryPage;
