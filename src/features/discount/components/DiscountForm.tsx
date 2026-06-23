import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../shared/components/ui/Button";
import Input from "../../../shared/components/ui/Input";
import { discountSchema, type DiscountInput } from "@/shared/validations";

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

const DiscountForm = ({ onSubmit, isPending, onCancel }: DiscountFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<DiscountInput>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      code: "",
      type: "PROMO",
      value: 0,
      isPercent: false,
      usageLimit: undefined,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      userLimit: undefined,
      applicableStores: [],
      applicableProducts: [],
    },
  });

  const onSubmitForm = (data: DiscountInput) => {
    onSubmit({
      code: data.code,
      type: data.type,
      value: data.value,
      isPercent: data.isPercent,
      maxUses: data.usageLimit ?? null,
      expiredAt: data.endDate,
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
        <select
          {...register("type")}
          className="input-neo w-full !text-sm !py-2"
        >
          <option value="PROMO">Promo</option>
          <option value="VOUCHER">Voucher</option>
        </select>
        <Input
          type="number"
          {...register("value", { valueAsNumber: true })}
          className="input-neo w-full !text-sm !py-2"
          placeholder="Nilai diskon"
          min="1"
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
          type="number"
          {...register("usageLimit", { valueAsNumber: true })}
          className="input-neo w-full !text-sm !py-2"
          placeholder="Maks penggunaan (opsional)"
          min="1"
        />
        <Input
          type="date"
          {...register("endDate")}
          className="input-neo w-full !text-sm !py-2"
          error={errors.endDate?.message}
        />
      </form>
      <div className="flex items-center gap-3 mt-4">
        <Button type="submit" variant="primary" loading={isPending}>
          {isPending ? "Menyimpan..." : "Simpan"}
        </Button>
        <Button type="button" onClick={onCancel} variant="ghost">
          Batal
        </Button>
      </div>
    </div>
  );
};

export default DiscountForm;
