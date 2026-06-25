import React, { useState, useMemo } from "react";
import ErrorState from "../../../shared/components/ui/ErrorState";
import Spinner from "../../../shared/components/ui/Spinner";
import NeoCalendar from "../../../shared/components/ui/NeoCalendar";
import useInfiniteScroll from "../../../shared/hooks/useInfiniteScroll";
import { useWallet, useTransactions } from "../../../features/wallet/hooks/useWallet";

const ALL_LIMIT = 1000;

const toLocalDateStr = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const DriverIncomePage: React.FC = () => {
  const { data: wallet, isLoading: walletLoading, error: walletError } = useWallet() as any;

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const hasFilter = !!startDate || !!endDate;

  const apiFilters = useMemo(() => ({
    ...(startDate ? { startDate: toLocalDateStr(startDate) } : {}),
    ...(endDate ? { endDate: toLocalDateStr(endDate) } : {}),
  }), [startDate, endDate]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: txLoading, error: txError, isFetching } = useTransactions(apiFilters, hasFilter ? ALL_LIMIT : undefined) as any;

  const loading = walletLoading || txLoading;
  const error = walletError || txError;
  const transactions = data?.pages.flatMap((p: any) => p.data) ?? [];
  const totalIncome = transactions.reduce((sum: number, tx: any) => sum + tx.amount, 0);

  const sentinelRef = useInfiniteScroll(fetchNextPage, {
    enabled: !hasFilter && hasNextPage && !isFetchingNextPage,
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
        <h1 className="text-2xl font-bold text-text-primary mb-1">Pemasukkan</h1>
        <p className="text-sm text-text-muted mb-6">Riwayat pendapatan dari pengiriman</p>
        <ErrorState message="Gagal memuat data pemasukkan." onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-text-primary mb-1">Pemasukkan</h1>
      <p className="text-sm text-text-muted mb-6">Riwayat pendapatan dari pengiriman</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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

      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <p className="text-xs font-semibold text-text-muted mb-1.5">Filter Tanggal</p>
            <button
              type="button"
              onClick={() => setShowCalendar(true)}
              className="w-full border-[3px] border-brand-deep px-3 py-2 text-sm text-left bg-white hover:bg-brand-subtle transition-colors"
            >
              {startDate
                ? `${startDate.toLocaleDateString("id-ID")}${endDate ? ` — ${endDate.toLocaleDateString("id-ID")}` : ""}`
                : "Pilih periode..."}
            </button>
          </div>
          {hasFilter && (
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => { setStartDate(null); setEndDate(null); }}
                className="text-xs text-danger hover:underline whitespace-nowrap"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </div>

      {showCalendar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div onClick={(e) => e.stopPropagation()}>
            <NeoCalendar
              startDate={startDate}
              endDate={endDate}
              onStartChange={(d: Date | null) => setStartDate(d)}
              onEndChange={(d: Date | null) => setEndDate(d)}
              onClose={() => setShowCalendar(false)}
            />
          </div>
        </div>
      )}

      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-text-primary">Riwayat Transaksi</h2>
          <span className="text-xs text-text-muted">{transactions.length} transaksi</span>
        </div>
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
            {hasFilter && isFetching && (
              <div className="flex justify-center py-3">
                <Spinner />
              </div>
            )}
            {!hasFilter && isFetchingNextPage && (
              <div className="flex justify-center py-3">
                <Spinner />
              </div>
            )}
            {!hasFilter && hasNextPage && !isFetchingNextPage && (
              <div ref={sentinelRef} className="h-4" />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default DriverIncomePage;
