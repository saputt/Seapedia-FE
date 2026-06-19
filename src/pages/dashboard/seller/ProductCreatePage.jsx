import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createProduct } from "../../../features/catalog/api/catalog.api";
import { apiFetch } from "../../../api/client";
import Button from "../../../shared/components/ui/Button";
import AlertModal from "../../../shared/components/ui/AlertModal";
import CategoryPicker from "../../../shared/components/ui/CategoryPicker";
import { getReadableError } from "../../../shared/utils/errorMapper";
import { getMyStore } from "../../../features/store/api/store.api";

const ProductCreatePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const { data: store } = useQuery({
    queryKey: ["myStore"],
    queryFn: getMyStore,
  });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("HOBBY");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [successModal, setSuccessModal] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (data instanceof FormData) {
        return apiFetch(`products/${store.id}`, {
          method: "POST",
          body: data,
        });
      }
      return createProduct(store.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerProducts"] });
      setSuccessModal(true);
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (imageFile) {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("description", description.trim());
      fd.append("price", parseInt(price, 10));
      fd.append("stock", parseInt(stock, 10));
      fd.append("category", category);
      fd.append("image", imageFile);
      mutation.mutate(fd);
    } else {
      mutation.mutate({
        name: name.trim(),
        description: description.trim(),
        price: parseInt(price, 10),
        stock: parseInt(stock, 10),
        category,
      });
    }
  };

  return (
    <>
      <button
        onClick={() => navigate("/dashboard/seller/products")}
        className="inline-flex items-center gap-1 text-text-secondary hover:text-brand-deep transition-colors mb-4 font-medium"
      >
        &larr; Kembali
      </button>

      <h1 className="text-2xl font-bold text-text-primary mb-6">Tambah Produk</h1>

      {mutation.isError && (
        <div className="mb-4 p-3 border-[3px] border-danger bg-danger/5">
          <p className="text-danger text-sm font-medium">{getReadableError(mutation.error)}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex gap-8 flex-col md:flex-row">
          {/* Left — Image Upload */}
          <div className="w-full md:w-80 shrink-0">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square border-[3px] border-dashed border-border bg-bg-secondary rounded flex flex-col items-center justify-center cursor-pointer hover:bg-brand-subtle transition-colors overflow-hidden"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <span className="text-3xl block mb-2">📷</span>
                  <span className="text-sm text-text-muted font-medium">Klik untuk upload gambar</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {imagePreview && (
              <button
                type="button"
                onClick={() => { fileInputRef.current?.click(); }}
                className="text-xs text-brand-deep font-semibold mt-2 hover:underline"
              >
                Ganti Gambar
              </button>
            )}
          </div>

          {/* Right — Form */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-text-secondary font-medium text-sm mb-1">Nama Produk</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-neo w-full" placeholder="Nama produk" required />
            </div>
            <div>
              <label className="block text-text-secondary font-medium text-sm mb-1">Deskripsi</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-neo w-full resize-none h-20" placeholder="Deskripsi produk" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-text-secondary font-medium text-sm mb-1">Harga (Rp)</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="input-neo w-full" placeholder="50000" min="0" required />
              </div>
              <div>
                <label className="block text-text-secondary font-medium text-sm mb-1">Stok</label>
                <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="input-neo w-full" placeholder="10" min="0" required />
              </div>
            </div>
            <div>
              <label className="block text-text-secondary font-medium text-sm mb-1">Kategori</label>
              <CategoryPicker value={category} onChange={setCategory} />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" onClick={() => navigate("/dashboard/seller/products")} variant="ghost" fullWidth>Batal</Button>
              <Button type="submit" variant="primary" fullWidth loading={mutation.isPending}>
                {mutation.isPending ? "Menambah..." : "Tambah"}
              </Button>
            </div>
          </div>
        </div>
      </form>

      <AlertModal
        isOpen={successModal}
        onClose={() => { setSuccessModal(false); navigate("/dashboard/seller/products"); }}
        icon="✅"
        title="Berhasil"
        message="Produk berhasil ditambahkan!"
        actionLabel="Kembali"
        onAction={() => navigate("/dashboard/seller/products")}
      />
    </>
  );
};

export default ProductCreatePage;
