import React from "react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../shared/components/ui/Button";
import ErrorState from "../../../shared/components/ui/ErrorState";
import Spinner from "../../../shared/components/ui/Spinner";
import NeoCalendar from "../../../shared/components/ui/NeoCalendar";
import CustomSelect from "../../../shared/components/ui/CustomSelect";
import { useWallet, useTransactions } from "../../../features/wallet/hooks/useWallet";
import { WALLET_TYPE_LABEL } from "../../../shared/constants/wallet";

const ALL_LIMIT = 1000;

const TransactionHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: wallet, isLoading: walletLoading, error: walletError } = useWallet();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [showCalendar, setShowCalendar] = useState(false);

  const hasFilter = !!startDate || !!endDate || typeFilter !== "ALL";

  const apiFilters = useMemo(() => ({
    ...(startDate ? { startDate: startDate.toISOString().split("T")[0] } : {}),
    ...(endDate ? { endDate: endDate.toISOString().split("T")[0] } : {}),
    ...(typeFilter !== "ALL" ? { type: typeFilter } : {}),
  }), [startDate, endDate, typeFilter]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: txLoading, error: txError, isFetching } = useTransactions(apiFilters, hasFilter ? ALL_LIMIT : undefined);

  const error = walletError || txError;
  const initialLoading = (walletLoading || txLoading) && !data;
  const transactions = useMemo(() => data?.pages.flatMap((p: any) => p.data) ?? [], [data]);

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-[720px] mx-auto w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Riwayat Transaksi</h1>
            <p className="text-sm text-text-muted mt-0.5">
              Saldo: Rp{wallet?.balance?.toLocaleString("id-ID") ?? 0}
            </p>
          </div>
          <Button variant="ghost" onClick={() => navigate("/wallet")}>
            &larr; Kembali
          </Button>
        </div>

        {error && (
          <ErrorState message={error?.message || "Gagal memuat data."} onRetry={() => window.location.reload()} />
        )}

        {!error && (
          <>
            <div className="card">
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
                <div className="sm:w-48">
                  <p className="text-xs font-semibold text-text-muted mb-1.5">Jenis Transaksi</p>
                  <CustomSelect
                    value={typeFilter}
                    options={[["ALL", "Semua"], ...Object.entries(WALLET_TYPE_LABEL)]}
                    onChange={setTypeFilter}
                  />
                </div>
                {hasFilter && (
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => {
                        setStartDate(null);
                        setEndDate(null);
                        setTypeFilter("ALL");
                      }}
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
                <h2 className="text-sm font-bold text-text-primary">
                  {typeFilter === "ALL" ? "Semua Transaksi" : WALLET_TYPE_LABEL[typeFilter]}
                </h2>
                <span className="text-xs text-text-muted">{transactions.length} transaksi</span>
              </div>

              {transactions.length === 0 ? (
                <p className="text-sm text-text-secondary text-center py-6">Tidak ada transaksi.</p>
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
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <p
                        className={`text-sm font-semibold ${
                          tx.type === "TOP_UP" || tx.type === "REFUND" || tx.type === "SELLER_EARNING" || tx.type === "DRIVER_EARNING"
                            ? "text-success"
                            : "text-danger"
                        }`}
                      >
                        {(tx.type === "TOP_UP" || tx.type === "REFUND" || tx.type === "SELLER_EARNING" || tx.type === "DRIVER_EARNING")
                          ? `+Rp${tx.amount.toLocaleString("id-ID")}`
                          : `-Rp${tx.amount.toLocaleString("id-ID")}`}
                      </p>
                    </div>
                  ))}
                  {!hasFilter && isFetchingNextPage && (
                    <div className="flex justify-center py-3">
                      <Spinner />
                    </div>
                  )}
                  {!hasFilter && hasNextPage && !isFetchingNextPage && (
                    <div className="flex justify-center pt-2">
                      <Button variant="ghost" onClick={() => fetchNextPage()} loading={isFetchingNextPage}>
                        Muat Lebih Banyak
                      </Button>
                    </div>
                  )}
                  {hasFilter && isFetching && (
                    <div className="flex justify-center py-3">
                      <Spinner />
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
  );
};

export default TransactionHistoryPage;
