import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import { storeSchema, type StoreInput } from "@/shared/validations";

interface StoreFormProps {
  onSubmit: (data: StoreInput) => void;
  isPending?: boolean;
  defaultValues?: Partial<StoreInput>;
  onCancel?: () => void;
}

export const StoreForm = ({ onSubmit, isPending = false, defaultValues, onCancel }: StoreFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StoreInput>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        {...register("name")}
        label="Nama Toko"
        placeholder="cth: Toko Sejahtera"
        error={errors.name?.message}
      />

      <div>
        <label className="block text-text-secondary font-medium text-sm mb-1.5">
          Deskripsi Toko
        </label>
        <textarea
          {...register("description")}
          className="input-neo w-full resize-none h-28"
          placeholder="Ceritakan tentang toko Anda..."
        />
        {errors.description && <p className="text-danger text-sm mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label className="block text-text-secondary font-medium text-sm mb-1.5">
          Alamat Toko
        </label>
        <textarea
          {...register("address")}
          className="input-neo w-full resize-none h-24"
          placeholder="Jl. Contoh No. 123, Kecamatan, Kota, Provinsi"
        />
        {errors.address && <p className="text-danger text-sm mt-1">{errors.address.message}</p>}
      </div>

      <div className="flex gap-3">
        {onCancel && (
          <Button type="button" onClick={onCancel} variant="ghost" size="lg" fullWidth>
            Batal
          </Button>
        )}
        <Button type="submit" variant="primary" size="lg" fullWidth loading={isPending}>
          {isPending ? "Membuat..." : "Buat Toko"}
        </Button>
      </div>
    </form>
  );
};