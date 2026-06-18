import { useState } from "react";
import { useSimulateOverdue } from "../../../features/admin/hooks/useAdmin";

const SHIPPING_LABEL = { INSTANT: "Instan", NEXT_DAY: "Besok", REGULAR: "Reguler" };
const SHIPPING_COLOR = { INSTANT: "text-warning", NEXT_DAY: "text-info", REGULAR: "text-text-primary" };

const AdminSimulatePage = () => {
  const [result, setResult] = useState(null);
  const mutation = useSimulateOverdue();

  const handleSimulate = async () => {
    setResult(null);
    try {
      const res = await mutation.mutateAsync();
      setResult({ success: true, data: res });
    } catch (e) {
      setResult({ success: false, message: e?.message || "Simulasi gagal." });
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-text-primary mb-1">Simulasi Overdue</h1>
      <p className="text-sm text-text-muted mb-6">Jalankan pembatalan otomatis pesanan yang melewati batas SLA</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card lg:col-span-2">
          <h2 className="text-sm font-bold text-text-primary mb-3">Aturan SLA</h2>
          <p className="text-sm text-text-secondary mb-4">
            Sistem akan membatalkan pesanan yang menggantung dan melewati batas waktu berikut:
          </p>
          <div className="space-y-2">
            {[
              { method: "INSTANT", label: "Instan", days: 1, desc: "Pesanan lewat 1 hari otomatis dibatalkan" },
              { method: "NEXT_DAY", label: "Besok", days: 2, desc: "Pesanan lewat 2 hari otomatis dibatalkan" },
              { method: "REGULAR", label: "Reguler", days: 3, desc: "Pesanan lewat 3 hari otomatis dibatalkan" },
            ].map((sla) => (
              <div key={sla.method} className="flex items-center gap-3 px-3 py-2 rounded bg-brand-subtle">
                <span className={`text-sm font-bold ${SHIPPING_COLOR[sla.method]}`}>{sla.label}</span>
                <span className="text-sm text-text-secondary">{sla.desc}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleSimulate}
            disabled={mutation.isPending}
            className="btn-primary text-sm !py-2.5 !px-8 mt-6"
          >
            {mutation.isPending ? "Memproses..." : "Jalankan Simulasi"}
          </button>

          {mutation.isPending && (
            <div className="flex items-center gap-2 mt-4 text-sm text-text-muted">
              <span className="w-4 h-4 border-[2px] border-brand-deep border-t-transparent rounded-full animate-spin" />
              Mencari dan memproses pesanan overdue...
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-sm font-bold text-text-primary mb-3">Informasi</h2>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-warning mt-0.5">•</span>
              <span>Hanya pesanan dengan status <strong>Menunggu Konfirmasi</strong> atau <strong>Siap Dikirim</strong> yang diproses</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-0.5">•</span>
              <span>Buyer mendapat refund penuh ke wallet</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-info mt-0.5">•</span>
              <span>Stok produk dikembalikan ke toko</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-text-muted mt-0.5">•</span>
              <span>Riwayat status otomatis tercatat</span>
            </li>
          </ul>
        </div>
      </div>

      {result && !result.success && (
        <div className="card">
          <p className="text-danger font-semibold">{result.message}</p>
        </div>
      )}

      {result && result.success && result.data && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="card text-center">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Total Diproses</p>
              <p className="text-3xl font-bold text-brand-deep">{result.data.summary?.totalProcessed ?? 0}</p>
            </div>
            <div className="card text-center">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Total Refund</p>
              <p className="text-3xl font-bold text-success">
                Rp{(result.data.summary?.totalRefund ?? 0).toLocaleString("id-ID")}
              </p>
            </div>
            <div className="card text-center">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">SLA Terpakai</p>
              {Object.entries(result.data.slaApplied ?? {}).map(([method, days]) => (
                <p key={method} className="text-xs text-text-secondary">
                  {SHIPPING_LABEL[method] || method}: {days}
                </p>
              ))}
            </div>
            <div className="card text-center">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Diproses Pada</p>
              <p className="text-sm font-medium text-text-primary">
                {new Date(result.data.processedAt).toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {["INSTANT", "NEXT_DAY", "REGULAR"].map((method) => (
              <div key={method} className="card">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
                  {SHIPPING_LABEL[method] || method}
                </p>
                <p className={`text-2xl font-bold ${SHIPPING_COLOR[method]}`}>
                  {result.data.summary?.byMethod?.[method] ?? 0}
                </p>
                <p className="text-xs text-text-muted mt-1">pesanan</p>
              </div>
            ))}
          </div>

          {result.data.logs && result.data.logs.length > 0 && (
            <div className="card">
              <h2 className="text-sm font-bold text-text-primary mb-3">Log Eksekusi</h2>
              <div className="max-h-64 overflow-y-auto space-y-1">
                {result.data.logs.map((log, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs font-mono text-text-secondary py-1 border-b border-border last:border-0">
                    <span className="text-text-muted shrink-0">#{i + 1}</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.data.logs && result.data.logs.length === 0 && (
            <div className="card text-center py-6">
              <p className="text-sm text-text-secondary">Tidak ada pesanan overdue yang perlu diproses.</p>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default AdminSimulatePage;
