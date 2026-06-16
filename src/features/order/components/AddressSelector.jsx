import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAddresses } from "../../../features/address/hooks/useAddresses";
import { createAddress } from "../api/order.api";

const AddressSelector = ({ isOpen, onClose, onSelect, selectedId }) => {
  const queryClient = useQueryClient();
  const { data: addresses = [], isLoading } = useAddresses(isOpen);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: "", completeAddress: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowForm(false);
      setForm({ label: "", completeAddress: "" });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!form.label.trim() || !form.completeAddress.trim()) return;
    setSaving(true);
    try {
      await createAddress(form);
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setShowForm(false);
      setForm({ label: "", completeAddress: "" });
    } catch (e) { /* handled */ }
    setSaving(false);
  };

  const handleBack = () => {
    setShowForm(false);
    setForm({ label: "", completeAddress: "" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg border-[3px] border-brand-deep shadow-[6px_6px_0px_0px] shadow-brand-deep max-h-[75vh] flex flex-col">

        <div className="flex items-center justify-between px-5 py-4 border-b-[3px] border-brand-deep">
          {showForm ? (
            <>
              <div className="flex items-center gap-3">
                <button onClick={handleBack} className="text-lg font-bold text-text-primary leading-none">&larr;</button>
                <h2 className="text-sm font-bold text-text-primary">Alamat Baru</h2>
              </div>
              <button onClick={onClose} className="text-lg font-bold text-text-muted hover:text-text-primary leading-none">&times;</button>
            </>
          ) : (
            <>
              <h2 className="text-sm font-bold text-text-primary">Pilih Alamat</h2>
              <button onClick={onClose} className="text-lg font-bold text-text-muted hover:text-text-primary leading-none">&times;</button>
            </>
          )}
        </div>

        {showForm ? (
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
            <input
              type="text"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className="w-full border-[3px] border-brand-deep px-3 py-2 text-sm outline-none focus:bg-brand-subtle"
              placeholder="Label (contoh: Rumah, Kantor)"
            />
            <textarea
              value={form.completeAddress}
              onChange={(e) => setForm({ ...form, completeAddress: e.target.value })}
              className="w-full border-[3px] border-brand-deep px-3 py-2 text-sm outline-none focus:bg-brand-subtle resize-none"
              rows={4}
              placeholder="Alamat lengkap"
            />
            <button
              onClick={handleCreate}
              disabled={saving || !form.label.trim() || !form.completeAddress.trim()}
              className="w-full border-[3px] border-brand-deep bg-brand-deep text-white px-5 py-3 text-sm font-bold hover:shadow-[4px_4px_0px_0px] hover:shadow-brand-deep transition-all disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <span className="w-6 h-6 border-[3px] border-brand-deep border-t-transparent rounded-full animate-spin" />
                </div>
              ) : addresses.length === 0 ? (
                <p className="text-sm text-text-secondary text-center py-8">Belum ada alamat tersimpan.</p>
              ) : (
                addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`flex items-start gap-3 p-3 border-[3px] transition-colors ${
                      selectedId === addr.id
                        ? "border-brand-deep bg-brand-subtle"
                        : "border-border hover:bg-brand-subtle/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="addr"
                      id={`addr-modal-${addr.id}`}
                      checked={selectedId === addr.id}
                      onChange={() => onSelect(addr)}
                      className="mt-1 accent-brand-deep"
                    />
                    <label htmlFor={`addr-modal-${addr.id}`} className="flex-1 cursor-pointer">
                      <p className="text-sm font-semibold text-text-primary">
                        {addr.label || "Alamat"}
                      </p>
                      {addr.completeAddress && (
                        <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                          {addr.completeAddress}
                        </p>
                      )}
                    </label>
                  </div>
                ))
              )}
            </div>

            <div className="border-t-[3px] border-brand-deep px-5 py-4">
              <button
                onClick={() => setShowForm(true)}
                className="w-full border-[3px] border-dashed border-brand-deep px-5 py-2.5 text-sm font-bold text-brand-deep hover:bg-brand-subtle transition-colors"
              >
                + Tambah Alamat Baru
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default AddressSelector;
