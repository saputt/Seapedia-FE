import { useEffect, useState } from "react";
import Navbar from "../../../shared/components/layout/Navbar";
import Footer from "../../../shared/components/layout/Footer";
import {
  getWallet,
  topUp,
  getTransactions,
} from "../../../features/wallet/api/wallet.api";

const TYPE_LABEL = {
  TOP_UP: "Top Up",
  PAYMENT: "Pembayaran",
  REFUND: "Refund",
  SELLER_EARNING: "Pendapatan Toko",
  DRIVER_EARNING: "Pendapatan Driver",
};

const WalletPage = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [topUpAmount, setTopUpAmount] = useState("");
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [topUpError, setTopUpError] = useState("");
  const [topUpSuccess, setTopUpSuccess] = useState("");

  useEffect(() => {
    Promise.all([getWallet(), getTransactions()])
      .then(([walletData, txData]) => {
        setWallet(walletData);
        setTransactions(txData);
      })
      .catch((err) => setError(err?.message || "Gagal memuat dompet."))
      .finally(() => setLoading(false));
  }, []);

  const handleTopUp = async () => {
    const amount = parseInt(topUpAmount, 10);
    if (!amount || amount < 1) return;

    setTopUpLoading(true);
    setTopUpError("");
    setTopUpSuccess("");
    try {
      await topUp(amount);
      const [walletData, txData] = await Promise.all([
        getWallet(),
        getTransactions(),
      ]);
      setWallet(walletData);
      setTransactions(txData);
      setTopUpSuccess(`Top up Rp${amount.toLocaleString("id-ID")} berhasil!`);
      setTopUpAmount("");
      setShowTopUp(false);
    } catch (err) {
      setTopUpError(err?.message || "Top up gagal.");
    } finally {
      setTopUpLoading(false);
    }
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
            <p className="text-danger font-semibold mb-4">{error}</p>
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
            {/* Balance Card */}
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
                    type="number"
                    min="1"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleTopUp()}
                    className="input-neo w-full !py-2 !text-sm"
                    placeholder="Jumlah top up"
                  />
                  <button
                    onClick={handleTopUp}
                    disabled={topUpLoading || !topUpAmount.trim()}
                    className="btn-primary text-sm !py-2 !px-5"
                  >
                    {topUpLoading ? "Memproses..." : "Konfirmasi"}
                  </button>
                  <button
                    onClick={() => {
                      setShowTopUp(false);
                      setTopUpError("");
                      setTopUpSuccess("");
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
              {topUpError && (
                <p className="text-danger text-xs mt-2">{topUpError}</p>
              )}
              {topUpSuccess && (
                <p className="text-success text-xs mt-2">{topUpSuccess}</p>
              )}
            </div>

            {/* Transaction History */}
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
                  {transactions.map((tx) => (
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
