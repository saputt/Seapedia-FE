import { useState } from "react";
import Button from "../../../shared/components/ui/Button";

interface DiscountFormState {
  code: string;
  type: string;
  value: string;
  isPercent: boolean;
  maxUses: string;
  expiredAt: string;
}

interface DiscountSubmitData {
  code: string;
  type: string;
  value: number;
  isPercent: boolean;
  maxUses: number | null;
  expiredAt: string;
}

interface DiscountFormProps {
  onSubmit: (data: DiscountSubmitData) => void;
  isPending: boolean;
  onCancel: () => void;
}

const formInitial: DiscountFormState = { code: "", type: "PROMO", value: "", isPercent: false, maxUses: "", expiredAt: "" };

const DiscountForm = ({ onSubmit, isPending, onCancel }: DiscountFormProps) => {
  const [form, setForm] = useState<DiscountFormState>(formInitial);

  const handleSubmit = () => {
    if (!form.code || !form.value || !form.expiredAt) return;
    onSubmit({
      code: form.code,
      type: form.type,
      value: parseInt(form.value, 10),
      isPercent: form.isPercent,
      maxUses: form.maxUses ? parseInt(form.maxUses, 10) : null,
      expiredAt: new Date(form.expiredAt).toISOString(),
    });
  };

  return (
    <div className="card mb-6">
      <h3 className="text-sm font-bold text-text-primary mb-3">Buat Diskon Baru</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Kode diskon"
          value={form.code}
          onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
          className="input-neo w-full !text-sm !py-2"
        />
        <select
          value={form.type}
          onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
          className="input-neo w-full !text-sm !py-2"
        >
          <option value="PROMO">Promo</option>
          <option value="VOUCHER">Voucher</option>
        </select>
        <input
          type="text"
          inputMode="numeric"
          placeholder="Nilai diskon"
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
        <Button onClick={handleSubmit} variant="primary" loading={isPending}>
          {isPending ? "Menyimpan..." : "Simpan"}
        </Button>
        <Button onClick={onCancel} variant="ghost">
          Batal
        </Button>
      </div>
    </div>
  );
};

export default DiscountForm;
