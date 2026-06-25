import { useState } from "react";
import Button from "../../../shared/components/ui/Button";
import Input from "../../../shared/components/ui/Input";
import ImageUpload from "../../../shared/components/ui/ImageUpload";
import CategoryPicker from "../../../shared/components/ui/CategoryPicker";
import { uploadImage } from "../../../api/upload";
import type { ProductInput, ProductCategory } from "../../../types";
import { useZodForm } from "@/shared/hooks/useZodForm";
import { productSchema, type ProductInput as ProductInputType } from "@/shared/validations";
import { handleNumberInput, handleNumberKeyDown } from "@/shared/utils/numberInput";

interface ProductFormProps {
  initialData?: ProductInput | null;
  onSubmit: (data: ProductInput) => Promise<void>;
  isPending?: boolean;
  submitLabel?: string;
  pendingLabel?: string;
  onCancel?: () => void;
}

const ProductForm = ({
  initialData = null,
  onSubmit,
  isPending = false,
  submitLabel = "Simpan",
  pendingLabel = "Menyimpan...",
  onCancel,
}: ProductFormProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useZodForm(productSchema, {
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price?.toString() || "",
    stock: initialData?.stock?.toString() || "",
    category: initialData?.category || "HOBBY",
    images: initialData?.imageUrl ? [initialData.imageUrl] : [],
  });

  const handleImageChange = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    // Update images array in form
    setValue("images", [URL.createObjectURL(file)]);
  };

  const onSubmitForm = async (data: ProductInputType) => {
    const payload: ProductInput = {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      category: data.category,
    };

    if (imageFile) {
      setUploading(true);
      const result = await uploadImage(imageFile);
      payload.imageUrl = result.url;
    }

    if (initialData?.imageUrl && !imageFile) {
      payload.imageUrl = initialData.imageUrl;
    }

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <div className="flex gap-8 flex-col md:flex-row">
        <ImageUpload preview={imagePreview} onChange={handleImageChange} />

        <div className="flex-1 space-y-4">
          <div>
            <label className="block text-text-secondary font-medium text-sm mb-1">Nama Produk</label>
            <Input
              {...register("name")}
              className="input-neo w-full"
              placeholder="Nama produk"
              error={errors.name?.message}
            />
          </div>
          <div>
            <label className="block text-text-secondary font-medium text-sm mb-1">Deskripsi</label>
            <textarea
              {...register("description")}
              className="input-neo w-full resize-none h-20"
              placeholder="Deskripsi produk"
            />
            {errors.description && <p className="text-danger text-sm mt-1">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-text-secondary font-medium text-sm mb-1">Harga (Rp)</label>
              <Input
                type="text"
                inputMode="numeric"
                {...register("price")}
                onChange={(e) => {
                  handleNumberInput(e, (val) => {
                    setValue("price", val, { shouldValidate: true });
                  });
                }}
                onKeyDown={handleNumberKeyDown}
                className="input-neo w-full"
                placeholder="50000"
                error={errors.price?.message}
              />
            </div>
            <div>
              <label className="block text-text-secondary font-medium text-sm mb-1">Stok</label>
              <Input
                type="text"
                inputMode="numeric"
                {...register("stock")}
                onChange={(e) => {
                  handleNumberInput(e, (val) => {
                    setValue("stock", val, { shouldValidate: true });
                  });
                }}
                onKeyDown={handleNumberKeyDown}
                className="input-neo w-full"
                placeholder="10"
                error={errors.stock?.message}
              />
            </div>
          </div>
          <div>
            <label className="block text-text-secondary font-medium text-sm mb-1">Kategori</label>
            <CategoryPicker
              value={watch("category")}
              onChange={(val) => setValue("category", val)}
            />
            {errors.category && <p className="text-danger text-sm mt-1">{errors.category.message}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" onClick={onCancel} variant="ghost" fullWidth>
              Batal
            </Button>
            <Button type="submit" variant="primary" fullWidth loading={isPending || uploading}>
              {uploading ? "Mengupload..." : isPending ? pendingLabel : submitLabel}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
