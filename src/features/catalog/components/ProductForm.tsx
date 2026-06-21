import { useState } from "react";
import Button from "../../../shared/components/ui/Button";
import ImageUpload from "../../../shared/components/ui/ImageUpload";
import CategoryPicker from "../../../shared/components/ui/CategoryPicker";
import type { ProductInput, ProductCategory } from "../../../types";

interface ProductFormProps {
  initialData?: ProductInput | null;
  onSubmit: (data: ProductInput | FormData) => Promise<void>;
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
  const [name, setName] = useState<string>(initialData?.name || "");
  const [description, setDescription] = useState<string>(initialData?.description || "");
  const [price, setPrice] = useState<string>(initialData?.price?.toString() || "");
  const [stock, setStock] = useState<string>(initialData?.stock?.toString() || "");
  const [category, setCategory] = useState<ProductCategory>(initialData?.category || "HOBBY");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);

  const handleImageChange = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ProductInput = {
      name: name.trim(),
      description: description.trim(),
      price: parseInt(price, 10),
      stock: parseInt(stock, 10),
      category,
    };

    if (imageFile) {
      const fd = new FormData();
      Object.entries(payload).forEach(([key, val]) => fd.append(key, String(val)));
      fd.append("image", imageFile);
      onSubmit(fd);
    } else {
      onSubmit(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-8 flex-col md:flex-row">
        <ImageUpload preview={imagePreview} onChange={handleImageChange} />

        <div className="flex-1 space-y-4">
          <div>
            <label className="block text-text-secondary font-medium text-sm mb-1">Nama Produk</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-neo w-full"
              placeholder="Nama produk"
              required
            />
          </div>
          <div>
            <label className="block text-text-secondary font-medium text-sm mb-1">Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-neo w-full resize-none h-20"
              placeholder="Deskripsi produk"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-text-secondary font-medium text-sm mb-1">Harga (Rp)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="input-neo w-full"
                placeholder="50000"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-text-secondary font-medium text-sm mb-1">Stok</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="input-neo w-full"
                placeholder="10"
                min="0"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-text-secondary font-medium text-sm mb-1">Kategori</label>
            <CategoryPicker value={category} onChange={setCategory} />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" onClick={onCancel} variant="ghost" fullWidth>
              Batal
            </Button>
            <Button type="submit" variant="primary" fullWidth loading={isPending}>
              {isPending ? pendingLabel : submitLabel}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
