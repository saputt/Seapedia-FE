import { useState } from "react";
import Button from "../../../shared/components/ui/Button";
import ImageUpload from "../../../shared/components/ui/ImageUpload";
import CategoryPicker from "../../../shared/components/ui/CategoryPicker";

/**
 * Form shared untuk create dan edit produk.
 * Digunakan di ProductCreatePage dan ProductEditPage.
 *
 * @param {Object} props
 * @param {Object} [props.initialData] - Data awal untuk edit mode (null untuk create)
 * @param {Function} props.onSubmit - Handler submit (data: FormData | Object) => Promise
 * @param {boolean} props.isPending - Status loading submit
 * @param {string} props.submitLabel - Label tombol submit
 * @param {string} props.pendingLabel - Label saat loading
 * @param {Function} props.onCancel - Handler batal
 */
const ProductForm = ({
  initialData = null,
  onSubmit,
  isPending = false,
  submitLabel = "Simpan",
  pendingLabel = "Menyimpan...",
  onCancel,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [stock, setStock] = useState(initialData?.stock?.toString() || "");
  const [category, setCategory] = useState(initialData?.category || "HOBBY");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || null);

  const handleImageChange = (file) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: parseInt(price, 10),
      stock: parseInt(stock, 10),
      category,
    };

    if (imageFile) {
      const fd = new FormData();
      Object.entries(payload).forEach(([key, val]) => fd.append(key, val));
      fd.append("image", imageFile);
      onSubmit(fd);
    } else {
      onSubmit(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-8 flex-col md:flex-row">
        {/* Image Upload */}
        <ImageUpload preview={imagePreview} onChange={handleImageChange} />

        {/* Form Fields */}
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
