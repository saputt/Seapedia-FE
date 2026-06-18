import { useState } from "react";
import { apiFetch } from "../../../api/client";

const DISCOUNT_TYPE_LABEL = {
  VOUCHER: { label: "Voucher", color: "text-info" },
  PROMO: { label: "Promo", color: "text-warning" },
};

const AdminDiscountsPage = ({ type = "PROMO" }) => {
  const [discounts, setDiscounts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    code: "",
    value: "",
    isPercent: false,
    maxUses: "",
    expiredAt: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchDiscounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("discounts/all");
      const all = res?.data ?? [];
      setDiscounts(all.filter((d) => d.type === type));
    } catch (e) {
      setError(e?.message || "Gagal memuat data");
    }
    setLoading(false);
  };

  useState(() => { fetchDiscounts(); }, [type]);

  const handleCreate = async () => {
    if (!form.code || !form.value || !form.expiredAt) return;
    setSubmitting(true);
    try {
      await apiFetch("discounts", {
        method: "POST",
        body: JSON.stringify({
          code: form.code,
          type,
          value: parseInt(form.value, 10),
          isPercent: form.isPercent,
          maxUses: form.maxUses ? parseInt(form.maxUses, 10) : null,
          expiredAt: new Date(form.expiredAt).toISOString(),
        }),
      });
      setShowCreate(false);
      setForm({ code: "", value: "", isPercent: false, maxUses: "", expiredAt: "" });
      fetchDiscounts();
    } catch (e) {
      setError(e?.message || "Gagal membuat diskon");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus diskon ini?")) return;
    try {
      await apiFetch(`discounts/${id}`, { method: "DELETE" });
      fetchDiscounts();
    } catch (e) {
      setError(e?.message || "Gagal menghapus");
    }
  };

  const label = DISCOUNT_TYPE_LABEL[type] || { label: type, color: "text-text-primary" };

  if (loading && !discounts) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-[3px] border-brand-deep border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-text-primary">Kelola {label.label}</h1>
        <button onClick={() => setShowCreate(true)} className="btn-primary text-sm !py-2 !px-5">
          + Buat {label.label}
        </button>
      </div>
      <p className="text-sm text-text-muted mb-6">Atur kode {label.label.toLowerCase()} untuk pengguna</p>

      {error && (
        <div className="card mb-4">
          <p className="text-danger text-sm">{error}</p>
          <button onClick={fetchDiscounts} className="btn-ghost text-sm !py-1 !px-4 mt-2">
            Coba Lagi
          </button>
        </div>
      )}

      {showCreate && (
        <div className="card mb-6">
          <h3 className="text-sm font-bold text-text-primary mb-3">Buat {label.label} Baru</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Kode (contoh: PROMO50)"
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
              className="input-neo w-full !text-sm !py-2"
            />
            <input
              type="text"
              inputMode="numeric"
              placeholder="Nilai"
              value={form.value}
              onChange={(e) => setForm((f) => ({ ...f, value: e.target.value.replace(/[^0-9]/g, "") }))}
              className="input-neo w-full !text-sm !py-2"
            />
            <label className="flex items-center gap-2 text-sm text-text-secondary">
              <input
                type="checkbox"
                checked={form.isPercent}
                onChange={(e) => setForm((f) => ({ ...f, isPercent: e.target.checked }))}
                className="accent-brand-deep"
              />
              Persentase
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Maks penggunaan (opsional)"
              value={form.maxUses}
              onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value.replace(/[^0-9]/g, "") }))}
              className="input-neo w-full !text-sm !py-2"
            />
            <input
              type="date"
              value={form.expiredAt}
              onChange={(e) => setForm((f) => ({ ...f, expiredAt: e.target.value }))}
              className="input-neo w-full !text-sm !py-2"
            />
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button onClick={handleCreate} disabled={submitting} className="btn-primary text-sm !py-2 !px-5">
              {submitting ? "Menyimpan..." : "Simpan"}
            </button>
            <button onClick={() => setShowCreate(false)} className="btn-ghost text-sm !py-2 !px-5">
              Batal
            </button>
          </div>
        </div>
      )}

      <div className="card">
        {!discounts || discounts.length === 0 ? (
          <p className="text-sm text-text-secondary text-center py-6">Belum ada {label.label.toLowerCase()}.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-border text-left text-text-muted">
                  <th className="pb-2 pr-4 font-semibold">Kode</th>
                  <th className="pb-2 pr-4 font-semibold">Nilai</th>
                  <th className="pb-2 pr-4 font-semibold">Pakai</th>
                  <th className="pb-2 pr-4 font-semibold">Maks</th>
                  <th className="pb-2 pr-4 font-semibold">Berakhir</th>
                  <th className="pb-2 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {discounts.map((d) => (
                  <tr key={d.id} className="border-b border-border hover:bg-brand-subtle transition-colors">
                    <td className="py-2.5 pr-4 font-mono font-medium text-text-primary">{d.code}</td>
                    <td className="py-2.5 pr-4 text-text-secondary">
                      {d.isPercent ? `${d.value}%` : `Rp${d.value?.toLocaleString("id-ID")}`}
                    </td>
                    <td className="py-2.5 pr-4 text-text-primary font-medium">{d.usedCount}</td>
                    <td className="py-2.5 pr-4 text-text-secondary">{d.maxUses ?? "∞"}</td>
                    <td className="py-2.5 pr-4 text-text-muted text-xs">
                      {new Date(d.expiredAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="py-2.5">
                      <button onClick={() => handleDelete(d.id)} className="text-danger font-semibold text-xs hover:underline">
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDiscountsPage;
