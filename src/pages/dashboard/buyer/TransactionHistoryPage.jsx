import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../shared/components/ui/Button";
import Spinner from "../../../shared/components/ui/Spinner";
import NeoCalendar from "../../../shared/components/ui/NeoCalendar";
import CustomSelect from "../../../shared/components/ui/CustomSelect";
import { useWallet, useTransactions } from "../../../features/wallet/hooks/useWallet";

const TYPE_LABEL = {
  TOP_UP: "Top Up",
  PAYMENT: "Pembayaran",
  REFUND: "Refund",
  SELLER_EARNING: "Pendapatan Toko",
  DRIVER_EARNING: "Pendapatan Driver",
};

const TransactionHistoryPage = () => {
  const navigate = useNavigate();
  const { data: wallet, isLoading: walletLoading, error: walletError } = useWallet();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: txLoading, error: txError } = useTransactions();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [showCalendar, setShowCalendar] = useState(false);

  const loading = walletLoading || txLoading;
  const error = walletError || txError;
  const filtered = useMemo(() => {
    const all = data?.pages.flatMap((p) => p.data) ?? [];
    let result = all;

    if (startDate) {
      const s = new Date(startDate);
      s.setHours(0, 0, 0, 0);
      result = result.filter((tx) => new Date(tx.createdAt) >= s);
    }
    if (endDate) {
      const e = new Date(endDate);
      e.setHours(23, 59, 59, 999);
      result = result.filter((tx) => new Date(tx.createdAt) <= e);
    }

    if (typeFilter !== "ALL") {
      result = result.filter((tx) => tx.type === typeFilter);
    }

    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return result;
  }, [data, startDate, endDate, typeFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-[720px] mx-auto w-full px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Riwayat Transaksi</h1>
            <p className="text-sm text-text-muted mt-0.5">
              Saldo: Rp{wallet?.balance?.toLocaleString("id-ID") ?? 0}
            </p>
          </div>
          <Button variant="ghost" onClick={() => navigate("/dashboard/buyer/wallet")}>
            &larr; Kembali
          </Button>
        </div>

        {error && (
          <div className="card text-center py-10">
            <p className="text-danger font-semibold mb-4">{error?.message || "Gagal memuat data."}</p>
            <Button onClick={() => window.location.reload()} variant="primary" size="sm">
              Coba Lagi
            </Button>
          </div>
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
                    options={[["ALL", "Semua"], ...Object.entries(TYPE_LABEL)]}
                    onChange={setTypeFilter}
                  />
                </div>
              </div>
            </div>

            {showCalendar && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                <div onClick={(e) => e.stopPropagation()}>
                  <NeoCalendar
                    startDate={startDate}
                    endDate={endDate}
                    onStartChange={(d) => setStartDate(d)}
                    onEndChange={(d) => setEndDate(d)}
                    onClose={() => setShowCalendar(false)}
                  />
                </div>
              </div>
            )}

            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-text-primary">
                  {typeFilter === "ALL" ? "Semua Transaksi" : TYPE_LABEL[typeFilter]}
                </h2>
                <span className="text-xs text-text-muted">{filtered.length} transaksi</span>
              </div>

              {filtered.length === 0 ? (
                <p className="text-sm text-text-secondary text-center py-6">Tidak ada transaksi.</p>
              ) : (
                <div className="space-y-2">
                  {filtered.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between px-3 py-2 rounded hover:bg-brand-subtle transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {TYPE_LABEL[tx.type] || tx.type}
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
                  {isFetchingNextPage && (
                    <div className="flex justify-center py-3">
                      <Spinner />
                    </div>
                  )}
                  {hasNextPage && !isFetchingNextPage && (
                    <div className="flex justify-center pt-2">
                      <Button variant="ghost" onClick={() => fetchNextPage()} loading={isFetchingNextPage}>
                        Muat Lebih Banyak
                      </Button>
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
