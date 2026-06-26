import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import Avatar from "@/shared/components/ui/Avatar";
import { uploadStoreImage } from "@/api/upload";
import { storeSchema, type StoreInput } from "@/shared/validations";
import { useFormPersist } from "@/shared/hooks/useFormPersist";

interface StoreFormProps {
  onSubmit: (data: StoreInput) => void;
  isPending?: boolean;
  defaultValues?: Partial<StoreInput>;
  onCancel?: () => void;
}

export const StoreForm = ({ onSubmit, isPending = false, defaultValues, onCancel }: StoreFormProps) => {
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(defaultValues?.imageUrl || null);

  const form = useForm<StoreInput>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      imageUrl: "",
      ...defaultValues,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = form;

  const { persist: persistForm, clearPersisted } = useFormPersist("store", form as any);
  const formValues = watch();
  useEffect(() => { persistForm(formValues); }, [formValues, persistForm]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadStoreImage(file);
      setValue("imageUrl", result.url);
      setImagePreview(result.url);
    } catch {
      /* ignore */
    }
    setUploading(false);
  };

  const handleFormSubmit = (data: StoreInput) => {
    clearPersisted();
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <div className="flex items-center gap-4 mb-4">
        <Avatar src={imagePreview} name={defaultValues?.name || "Toko"} size="lg" />
        <div>
          <label className="cursor-pointer text-sm text-brand-deep font-medium hover:underline">
            {imagePreview ? "Ganti Foto" : "Tambah Foto"}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
          {uploading && <p className="text-xs text-text-muted mt-1">Mengupload...</p>}
        </div>
      </div>

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