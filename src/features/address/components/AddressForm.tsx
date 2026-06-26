import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import { addressSchema, type AddressInput } from "@/shared/validations";
import { useFormPersist } from "@/shared/hooks/useFormPersist";

interface AddressFormProps {
  onSubmit: (data: AddressInput) => void;
  isPending?: boolean;
  defaultValues?: Partial<AddressInput>;
  onCancel?: () => void;
}

export const AddressForm = ({ onSubmit, isPending = false, defaultValues, onCancel }: AddressFormProps) => {
  const form = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: "",
      detail: "",
      ...defaultValues,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = form;

  const { persist: persistForm, clearPersisted } = useFormPersist("address", form as any);
  const formValues = watch();
  useEffect(() => { persistForm(formValues); }, [formValues, persistForm]);

  const handleSubmitForm = (data: AddressInput) => {
    clearPersisted();
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
      <Input
        {...register("label")}
        label="Label"
        placeholder="Rumah, Kantor, dll"
        error={errors.label?.message}
      />

      <div>
        <label className="block text-text-secondary font-medium text-sm mb-1">Alamat Lengkap</label>
        <textarea
          {...register("detail")}
          className="input-neo w-full resize-none h-24"
          placeholder="Jl. Contoh No. 123, Kecamatan, Kota, Provinsi, Kode Pos"
        />
        {errors.detail && <p className="text-danger text-sm mt-1">{errors.detail.message}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button type="button" onClick={onCancel} variant="ghost" fullWidth>
            Batal
          </Button>
        )}
        <Button type="submit" variant="primary" fullWidth loading={isPending}>
          {isPending ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
};