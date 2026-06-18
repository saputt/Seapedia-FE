import { useState } from "react";
import { useSimulateOverdue } from "../../../features/admin/hooks/useAdmin";

const AdminSimulatePage = () => {
  const [days, setDays] = useState("");
  const [result, setResult] = useState(null);
  const mutation = useSimulateOverdue();

  const handleSimulate = async () => {
    const dayToSkip = parseInt(days, 10);
    if (!dayToSkip || dayToSkip < 1) return;
    setResult(null);
    try {
      await mutation.mutateAsync(dayToSkip);
      setResult({ success: true, message: `Simulasi berhasil! Pesanan lebih dari ${dayToSkip} hari telah diproses.` });
    } catch (e) {
      setResult({ success: false, message: e?.message || "Simulasi gagal." });
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-text-primary mb-1">Simulasi Pesanan</h1>
      <p className="text-sm text-text-muted mb-6">Batalkan otomatis pesanan yang sudah melewati batas waktu</p>

      <div className="card max-w-lg">
        <p className="text-sm text-text-secondary mb-4">
          Masukkan jumlah hari untuk mensimulasikan pembatalan otomatis pesanan yang sudah melewati batas.
          Sistem akan membatalkan pesanan dengan status <strong>Menunggu Konfirmasi</strong> atau{" "}
          <strong>Siap Dikirim</strong> yang dibuat lebih dari jumlah hari yang ditentukan.
        </p>

        <label className="block text-sm font-semibold text-text-primary mb-1">Hari Lewat</label>
        <div className="flex items-center gap-3">
          <input
            type="text"
            inputMode="numeric"
            value={days}
            onChange={(e) => setDays(e.target.value.replace(/[^0-9]/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && handleSimulate()}
            className="input-neo w-full !py-2 !text-sm"
            placeholder="contoh: 7"
          />
          <button
            onClick={handleSimulate}
            disabled={mutation.isPending || !days.trim()}
            className="btn-primary text-sm !py-2 !px-6 whitespace-nowrap"
          >
            {mutation.isPending ? "Memproses..." : "Jalankan"}
          </button>
        </div>

        {result && (
          <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${
            result.success ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
          }`}>
            {result.message}
          </div>
        )}

        {mutation.isPending && (
          <div className="flex items-center gap-2 mt-4 text-sm text-text-muted">
            <span className="w-4 h-4 border-[2px] border-brand-deep border-t-transparent rounded-full animate-spin" />
            Memproses pembatalan pesanan...
          </div>
        )}
      </div>
    </>
  );
};

export default AdminSimulatePage;
