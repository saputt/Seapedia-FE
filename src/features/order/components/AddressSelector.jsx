import { useEffect, useState } from "react";
import {
  fetchAddresses,
  createAddress,
} from "../api/order.api";

const AddressSelector = ({ isOpen, onClose, onSelect, selectedId }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: "", completeAddress: "" });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setShowForm(false);
    fetchAddresses()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setAddresses(list);
        if (!selectedId && list.length > 0) {
          onSelect(list[0]);
        }
      })
      .catch(() => setAddresses([]))
      .finally(() => setLoading(false));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === "Escape" && !showForm) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose, showForm]);

  const handleCreate = async () => {
    if (!form.label.trim() || !form.completeAddress.trim()) {
      setFormError("Semua field harus diisi.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      const newAddr = await createAddress(form);
      setAddresses((prev) => [...prev, newAddr]);
      onSelect(newAddr);
      setShowForm(false);
      setForm({ label: "", completeAddress: "" });
    } catch (err) {
      setFormError(err?.message || "Gagal menyimpan alamat.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={() => !showForm && onClose()}
    >
      <div
        className="card max-w-md w-full max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-text-primary">
            {showForm ? "Tambah Alamat Baru" : "Pilih Alamat"}
          </h3>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="text-sm font-semibold text-brand-deep hover:underline"
            >
              + Baru
            </button>
          )}
        </div>

        <div className="overflow-y-auto flex-1 -mx-3 px-3">
          {loading && (
            <div className="space-y-3 animate-pulse">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 bg-bg-tertiary rounded" />
              ))}
            </div>
          )}

          {!loading && !showForm && addresses.length === 0 && (
            <p className="text-text-secondary text-sm text-center py-8">
              Belum ada alamat. Tambah alamat baru untuk melanjutkan.
            </p>
          )}

          {!loading && !showForm && addresses.length > 0 && (
            <div className="space-y-2">
              {addresses.map((addr) => (
                <button
                  key={addr.id}
                  onClick={() => onSelect(addr)}
                  className={`w-full text-left px-3 py-3 rounded border-[2px] transition-colors ${
                    selectedId === addr.id
                      ? "border-brand-deep bg-brand-subtle"
                      : "border-bg-tertiary hover:border-brand-light"
                  }`}
                >
                  <p className="text-sm font-semibold text-text-primary">
                    {addr.label}
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">
                    {addr.completeAddress}
                  </p>
                </button>
              ))}
            </div>
          )}

          {showForm && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-text-secondary mb-1 block">
                  Label
                </label>
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) =>
                    setForm({ ...form, label: e.target.value })
                  }
                  className="input-neo w-full !py-2 !text-sm"
                  placeholder="Rumah, Kantor, dll"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary mb-1 block">
                  Alamat Lengkap
                </label>
                <textarea
                  value={form.completeAddress}
                  onChange={(e) =>
                    setForm({ ...form, completeAddress: e.target.value })
                  }
                  className="input-neo w-full !py-2 !text-sm resize-none"
                  rows={3}
                  placeholder="Jl. Merdeka No. 123, Jakarta Pusat"
                />
              </div>
              {formError && (
                <p className="text-danger text-xs">{formError}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowForm(false);
                    setFormError("");
                  }}
                  className="btn-ghost text-sm !py-2 !px-5 flex-1"
                >
                  Batal
                </button>
                <button
                  onClick={handleCreate}
                  disabled={saving}
                  className="btn-primary text-sm !py-2 !px-5 flex-1"
                >
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </div>
          )}
        </div>

        {!showForm && addresses.length > 0 && (
          <button
            onClick={onClose}
            className="btn-ghost text-sm !py-2 !px-5 mt-4 w-full"
          >
            Tutup
          </button>
        )}
      </div>
    </div>
  );
};

export default AddressSelector;
