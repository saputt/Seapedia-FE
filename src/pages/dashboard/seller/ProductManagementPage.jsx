import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllProducts, createProduct, updateProduct, deleteProduct } from "../../../features/catalog/api/catalog.api";
import { getMyStore } from "../../../features/store/api/store.api";
import { getReadableError } from "../../../shared/utils/errorMapper";

const ProductFormModal = ({ storeId, product, onClose }) => {
  const queryClient = useQueryClient();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [stock, setStock] = useState(product?.stock?.toString() || "");
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || "");

  const mutation = useMutation({
    mutationFn: async (dto) => {
      if (isEdit) {
        return updateProduct(product.id, dto);
      }
      return createProduct(storeId, dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerProducts"] });
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      name: name.trim(),
      description: description.trim(),
      price: parseInt(price, 10),
      stock: parseInt(stock, 10),
      ...(imageUrl.trim() ? { imageUrl: imageUrl.trim() } : {}),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="card !p-6 mx-4 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-primary">{isEdit ? "Edit Produk" : "Tambah Produk"}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary text-xl leading-none">&times;</button>
        </div>

        {mutation.isError && (
          <div className="mb-4 p-3 border-[3px] border-danger bg-danger/5">
            <p className="text-danger text-sm font-medium">{getReadableError(mutation.error)}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block text-text-secondary font-medium text-sm mb-1">URL Gambar</label>
            <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="input-neo w-full" placeholder="https://..." />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 !py-2.5">Batal</button>
            <button type="submit" className="btn-primary flex-1 !py-2.5 flex items-center justify-center gap-2" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{isEdit ? "Menyimpan..." : "Menambah..."}</>
              ) : (
                isEdit ? "Simpan" : "Tambah"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProductManagementPage = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState("");

  const { data: store } = useQuery({
    queryKey: ["myStore"],
    queryFn: getMyStore,
  });

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["sellerProducts", store?.id, search],
    queryFn: () => getAllProducts({ storeId: store.id, limit: 100, search }),
    enabled: !!store?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerProducts"] });
    },
  });

  const products = productsData?.products || [];
  const total = productsData?.total || 0;

  return (
    <>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-text-primary">Produk</h1>
        <button onClick={() => { setEditingProduct(null); setShowForm(true); }} className="btn-primary text-sm !py-2 !px-4">
          + Tambah Produk
        </button>
      </div>
      <p className="text-sm text-text-muted mb-6">Kelola produk toko Anda ({total} produk)</p>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-neo w-full max-w-sm mb-6"
        placeholder="Cari produk..."
      />

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-[3px] border-brand-deep border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && products.length === 0 && (
        <div className="card !p-8 text-center">
          <p className="text-text-muted">{search ? "Produk tidak ditemukan" : "Belum ada produk. Tambahkan produk pertama Anda!"}</p>
        </div>
      )}

      {!isLoading && products.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-[3px] border-bg-tertiary">
                <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wide pb-3 pr-4">Produk</th>
                <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wide pb-3 pr-4 hidden sm:table-cell">Harga</th>
                <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wide pb-3 pr-4 hidden sm:table-cell">Stok</th>
                <th className="text-right text-xs font-semibold text-text-muted uppercase tracking-wide pb-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b-[2px] border-bg-tertiary/50 hover:bg-brand-subtle/30 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-bg-tertiary rounded flex items-center justify-center overflow-hidden shrink-0">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-text-muted">Img</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{product.name}</p>
                        <p className="text-xs text-text-muted truncate hidden sm:block">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 hidden sm:table-cell">
                    <p className="text-sm font-semibold text-text-primary">Rp{product.price?.toLocaleString("id-ID")}</p>
                  </td>
                  <td className="py-3 pr-4 hidden sm:table-cell">
                    <span className={`text-sm font-medium ${product.stock > 0 ? "text-success" : "text-danger"}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditingProduct(product); setShowForm(true); }}
                        className="btn-ghost text-xs !py-1.5 !px-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Hapus produk ini?")) {
                            deleteMutation.mutate(product.id);
                          }
                        }}
                        className="btn-danger text-xs !py-1.5 !px-3"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <ProductFormModal
          storeId={store?.id}
          product={editingProduct}
          onClose={() => { setShowForm(false); setEditingProduct(null); }}
        />
      )}
    </>
  );
};

export default ProductManagementPage;
