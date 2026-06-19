import { useState } from "react";
import { useSimulateOverdue, useResetSimulation, useSimulationStatus } from "../../../features/admin/hooks/useAdmin";
import Button from "../../../shared/components/ui/Button";
import Spinner from "../../../shared/components/ui/Spinner";

const SHIPPING_LABEL = { INSTANT: "Instan", NEXT_DAY: "Besok", REGULAR: "Reguler" };
const SHIPPING_COLOR = { INSTANT: "text-warning", NEXT_DAY: "text-info", REGULAR: "text-text-primary" };

const AdminSimulatePage = () => {
  const [days, setDays] = useState("1");
  const [result, setResult] = useState(null);
  const mutation = useSimulateOverdue();
  const resetMutation = useResetSimulation();
  const { data: simStatus, refetch: refetchStatus } = useSimulationStatus();

  const totalSkipped = simStatus?.data?.totalDaysSkipped ?? 0;

  const handleSimulate = async () => {
    const daysToSkip = parseInt(days, 10) || 1;
    setResult(null);
    try {
      const res = await mutation.mutateAsync(daysToSkip);
      setResult({ success: true, data: res });
    } catch (err) {
      setResult({ success: false, message: err?.message || "Simulasi gagal." });
    }
  };

  const handleReset = async () => {
    setResult(null);
    try {
      await resetMutation.mutateAsync();
      refetchStatus();
    } catch { /* handled */ }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-text-primary mb-1">Simulasi Overdue</h1>
      <p className="text-sm text-text-muted mb-6">Majukan waktu simulasi untuk memproses pesanan yang melewati batas SLA</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card lg:col-span-2">
          <h2 className="text-sm font-bold text-text-primary mb-3">Aturan SLA</h2>
          <div className="space-y-2 mb-6">
            {[
              { method: "INSTANT", label: "Instan", days: 1 },
              { method: "NEXT_DAY", label: "Besok", days: 2 },
              { method: "REGULAR", label: "Reguler", days: 3 },
            ].map((sla) => (
              <div key={sla.method} className="flex items-center gap-3 px-3 py-2 rounded bg-brand-subtle">
                <span className={`text-sm font-bold ${SHIPPING_COLOR[sla.method]}`}>{sla.label}</span>
                <span className="text-sm text-text-secondary">
                  Pesanan dibuat {sla.days} hari yang lalu (waktu simulasi) otomatis dibatalkan
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
            <label className="text-sm font-semibold text-text-primary whitespace-nowrap">Skip hari:</label>
            <input
              type="text"
              inputMode="numeric"
              value={days}
              onChange={(e) => setDays(e.target.value.replace(/[^0-9]/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && handleSimulate()}
              className="input-neo !py-2 !text-sm w-24"
              placeholder="1"
            />
            <Button
              onClick={handleSimulate}
              variant="primary"
              size="sm"
              loading={mutation.isPending}
              disabled={!days.trim()}
            >
              {mutation.isPending ? "Memproses..." : `Skip ${days || 1} Hari + Proses`}
            </Button>
            {totalSkipped > 0 && (
              <Button
                onClick={handleReset}
                variant="ghost"
                loading={resetMutation.isPending}
              >
                Reset Waktu
              </Button>
            )}
          </div>

          {mutation.isPending && (
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <Spinner size="sm" />
              Majuin waktu {days || 1} hari + proses overdue...
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-sm font-bold text-text-primary mb-3">Waktu Simulasi</h2>
          {simStatus?.data ? (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-text-muted">Tanggal Real</p>
                <p className="text-sm font-medium text-text-primary">
                  {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              <div className="border-t border-border pt-3">
                <p className="text-xs text-text-muted">Tanggal Simulasi</p>
                <p className="text-sm font-semibold text-brand-deep">
                  {new Date(simStatus.data.simulatedDate).toLocaleDateString("id-ID", {
                    day: "numeric", month: "long", year: "numeric"
                  })}
                </p>
              </div>
              <div className="border-t border-border pt-3">
                <p className="text-xs text-text-muted">Total Hari Dilewati</p>
                <p className="text-lg font-bold text-warning">{totalSkipped} hari</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-6">
              <Spinner size="sm" />
            </div>
          )}
        </div>
      </div>

      {result && !result.success && (
        <div className="card mb-6">
          <p className="text-danger font-semibold">{result.message}</p>
        </div>
      )}

      {result && result.success && result.data && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
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
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Hari Diskip</p>
              <p className="text-3xl font-bold text-warning">{result.data.daysSkipped}</p>
            </div>
            <div className="card text-center">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Total Skip</p>
              <p className="text-3xl font-bold text-warning">{result.data.totalDaysSkipped}</p>
            </div>
            <div className="card text-center">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Tanggal Simulasi</p>
              <p className="text-xs font-medium text-text-primary">
                {new Date(result.data.simulatedDate).toLocaleDateString("id-ID", {
                  day: "numeric", month: "short", year: "numeric"
                })}
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
                <p className="text-xs text-text-muted mt-1">pesanan overdue</p>
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
              <p className="text-sm text-text-secondary">Tidak ada pesanan overdue — semua pesanan masih dalam batas SLA.</p>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default AdminSimulatePage;
