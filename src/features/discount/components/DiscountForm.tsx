import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../shared/components/ui/Button";
import Input from "../../../shared/components/ui/Input";
import CustomSelect from "../../../shared/components/ui/CustomSelect";
import NeoCalendar from "../../../shared/components/ui/NeoCalendar";
import { discountSchema } from "@/shared/validations";
import type { DiscountInput } from "@/shared/validations";
import { handleNumberInput, handleNumberKeyDown } from "@/shared/utils/numberInput";
import { useFormPersist } from "@/shared/hooks/useFormPersist";

const DISCOUNT_TYPE_OPTIONS: [string, string][] = [
  ["PROMO", "Promo"],
  ["VOUCHER", "Voucher"],
];

interface DiscountSubmitData {
  code: string;
  type: "VOUCHER" | "PROMO";
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

const DiscountForm = ({ onSubmit, isPending, onCancel }: DiscountFormProps) => {
  const [showCalendar, setShowCalendar] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DiscountInput>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      code: "",
      type: "VOUCHER",
      value: 0,
      isPercent: false,
      usageLimit: undefined,
      expiredAt: "",
    },
  });

  const { persist: persistForm, clearPersisted } = useFormPersist("discount", { watch, setValue } as any);
  const formValues = watch();
  useEffect(() => { persistForm(formValues); }, [formValues, persistForm]);

  const discountType = watch("type");
  const expiredAt = watch("expiredAt");
  const isPercent = watch("isPercent");

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  const selectedDate = expiredAt ? new Date(expiredAt + "T00:00:00") : null;

  const onSubmitForm = (data: DiscountInput) => {
    clearPersisted();
    onSubmit({
      code: data.code,
      type: data.type,
      value: data.value,
      isPercent: data.isPercent,
      maxUses: data.usageLimit ?? null,
      expiredAt: data.expiredAt,
    });
  };

  return (
    <div className="card mb-6">
      <h3 className="text-sm font-bold text-text-primary mb-3">Buat Diskon Baru</h3>
      <form onSubmit={handleSubmit(onSubmitForm)} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          {...register("code")}
          className="input-neo w-full !text-sm !py-2"
          placeholder="Kode diskon"
          error={errors.code?.message}
        />
        <CustomSelect
          value={discountType}
          options={DISCOUNT_TYPE_OPTIONS}
          onChange={(val) => setValue("type", val as "PROMO" | "VOUCHER", { shouldValidate: true })}
        />
        <Input
          type="text"
          inputMode="numeric"
          name="value"
          onChange={(e) => {
            handleNumberInput(e, (val) => {
              setValue("value", val === "" ? 0 : parseInt(val, 10), { shouldValidate: true });
            });
          }}
          onKeyDown={handleNumberKeyDown}
          className="input-neo w-full !text-sm !py-2"
          placeholder="Nilai diskon"
          error={errors.value?.message}
        />
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input
            type="checkbox"
            {...register("isPercent")}
            className="accent-brand-deep"
          />
          Persentase
        </label>
        <Input
          type="text"
          inputMode="numeric"
          name="usageLimit"
          onChange={(e) => {
            handleNumberInput(e, (val) => {
              setValue("usageLimit", val === "" ? undefined : parseInt(val, 10), { shouldValidate: true });
            });
          }}
          onKeyDown={handleNumberKeyDown}
          className="input-neo w-full !text-sm !py-2"
          placeholder="Maks penggunaan (opsional)"
        />
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCalendar(true)}
            className="w-full border-[3px] border-brand-deep px-3 py-2 text-sm bg-white text-left hover:bg-brand-subtle transition-colors"
          >
            {expiredAt ? formatDateDisplay(expiredAt) : "Tanggal berakhir"}
          </button>
          {errors.expiredAt?.message && (
            <p className="text-xs text-danger mt-1">{errors.expiredAt?.message}</p>
          )}
        </div>
        <div className="sm:col-span-2 flex items-center gap-3 mt-2">
          <Button type="submit" variant="primary" loading={isPending}>
            {isPending ? "Menyimpan..." : "Simpan"}
          </Button>
          <Button type="button" onClick={onCancel} variant="ghost">
            Batal
          </Button>
        </div>
      </form>

      {showCalendar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div onClick={(e) => e.stopPropagation()}>
            <NeoCalendar
              startDate={selectedDate}
              endDate={selectedDate}
              onStartChange={(d) => {
                if (d) {
                  const year = d.getFullYear();
                  const month = String(d.getMonth() + 1).padStart(2, "0");
                  const day = String(d.getDate()).padStart(2, "0");
                  setValue("expiredAt", `${year}-${month}-${day}`, { shouldValidate: true });
                }
              }}
              onEndChange={() => {}}
              onClose={() => setShowCalendar(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountForm;
