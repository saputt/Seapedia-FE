import { useState } from "react";
import Navbar from "../../../shared/components/layout/Navbar";
import Footer from "../../../shared/components/layout/Footer";
import { useWallet, useTransactions, useTopUp } from "../../../features/wallet/hooks/useWallet";

const TYPE_LABEL = {
  TOP_UP: "Top Up",
  PAYMENT: "Pembayaran",
  REFUND: "Refund",
  SELLER_EARNING: "Pendapatan Toko",
  DRIVER_EARNING: "Pendapatan Driver",
};

const WalletPage = () => {
  const { data: wallet, isLoading: walletLoading, error: walletError } = useWallet();
  const { data: transactions = [], isLoading: txLoading, error: txError } = useTransactions();
  const topUpMutation = useTopUp();

  const [showAllTx, setShowAllTx] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [showTopUp, setShowTopUp] = useState(false);

  const loading = walletLoading || txLoading;
  const error = walletError || txError;

  const handleTopUp = async () => {
    const amount = parseInt(topUpAmount, 10);
    if (!amount || amount < 1) return;
    try {
      await topUpMutation.mutateAsync(amount);
      setTopUpAmount("");
      setShowTopUp(false);
    } catch (e) { /* error handled by mutation state */ }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-bg-primary">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <span className="w-8 h-8 border-[3px] border-brand-deep border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />

      <main className="flex-1 max-w-[720px] mx-auto w-full px-6 lg:px-8 py-8 space-y-6">
        {error && (
          <div className="card text-center py-10">
            <p className="text-danger font-semibold mb-4">{error?.message || "Gagal memuat dompet."}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary text-sm !py-2 !px-6"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!error && (
          <>
            <div className="card">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
                Saldo Dompet
              </p>
              <p className="text-3xl font-bold text-brand-deep">
                Rp{wallet?.balance?.toLocaleString("id-ID") ?? 0}
              </p>

              {showTopUp ? (
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={topUpAmount}
                    onChange={(e) =>
                      setTopUpAmount(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleTopUp()}
                    className="input-neo w-full !py-2 !text-sm"
                    placeholder="Jumlah top up"
                  />
                  <button
                    onClick={handleTopUp}
                    disabled={topUpMutation.isPending || !topUpAmount.trim()}
                    className="btn-primary text-sm !py-2 !px-5"
                  >
                    {topUpMutation.isPending ? "Memproses..." : "Konfirmasi"}
                  </button>
                  <button
                    onClick={() => {
                      setShowTopUp(false);
                      topUpMutation.reset();
                    }}
                    className="btn-ghost text-sm !py-2 !px-5"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowTopUp(true)}
                  className="btn-primary text-sm !py-2 !px-5 mt-4"
                >
                  Top Up
                </button>
              )}
              {topUpMutation.isError && (
                <p className="text-danger text-xs mt-2">{topUpMutation.error?.message || "Top up gagal."}</p>
              )}
              {topUpMutation.isSuccess && topUpMutation.variables && (
                <p className="text-success text-xs mt-2">Top up Rp{topUpMutation.variables.toLocaleString("id-ID")} berhasil!</p>
              )}
            </div>

            <div className="card">
              <h2 className="text-sm font-bold text-text-primary mb-3">
                Riwayat Transaksi
              </h2>
              {transactions.length === 0 ? (
                <p className="text-sm text-text-secondary text-center py-6">
                  Belum ada transaksi.
                </p>
              ) : (
                <div className="space-y-2">
                  {(showAllTx ? transactions : transactions.slice(0, 10)).map((tx) => (
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
                          })}
                        </p>
                      </div>
                      <p
                        className={`text-sm font-semibold ${
                          tx.type === "TOP_UP" || tx.type === "REFUND"
                            ? "text-success"
                            : tx.type === "PAYMENT"
                              ? "text-danger"
                              : "text-text-primary"
                        }`}
                      >
                        {tx.type === "TOP_UP" || tx.type === "REFUND"
                          ? `+Rp${tx.amount.toLocaleString("id-ID")}`
                          : `-Rp${tx.amount.toLocaleString("id-ID")}`}
                      </p>
                    </div>
                  ))}
                  {!showAllTx && transactions.length > 10 && (
                    <button
                      onClick={() => setShowAllTx(true)}
                      className="w-full text-center text-sm font-semibold text-brand-deep hover:bg-brand-subtle rounded px-3 py-2 transition-colors"
                    >
                      Lihat Semua ({transactions.length})
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default WalletPage;
