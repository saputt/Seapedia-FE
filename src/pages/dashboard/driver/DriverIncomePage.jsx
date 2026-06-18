import { useRef, useEffect } from "react";
import { useWallet, useTransactions } from "../../../features/wallet/hooks/useWallet";

const DriverIncomePage = () => {
  const { data: wallet, isLoading: walletLoading, error: walletError } = useWallet();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: txLoading, error: txError } = useTransactions();
  const sentinelRef = useRef(null);

  const loading = walletLoading || txLoading;
  const error = walletError || txError;
  const transactions = data?.pages.flatMap((p) => p.data) ?? [];
  const totalIncome = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage();
      },
      { rootMargin: "100px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-[3px] border-brand-deep border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">Pemasukkan</h1>
        <p className="text-sm text-text-muted mb-6">Riwayat pendapatan dari pengiriman</p>
        <div className="card text-center py-10">
          <p className="text-danger font-semibold mb-4">Gagal memuat data pemasukkan.</p>
          <button onClick={() => window.location.reload()} className="btn-primary text-sm !py-2 !px-6">
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-text-primary mb-1">Pemasukkan</h1>
      <p className="text-sm text-text-muted mb-6">Riwayat pendapatan dari pengiriman</p>

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
            Total Pendapatan
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
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between px-3 py-2 rounded hover:bg-brand-subtle transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-text-primary">Pendapatan Pengiriman</p>
                  <p className="text-xs text-text-muted">
                    {new Date(tx.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <p className="text-sm font-semibold text-success">
                  +Rp{tx.amount.toLocaleString("id-ID")}
                </p>
              </div>
            ))}
            {isFetchingNextPage && (
              <div className="flex justify-center py-3">
                <span className="w-6 h-6 border-[3px] border-brand-deep border-t-transparent rounded-full animate-spin" />
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

export default DriverIncomePage;
