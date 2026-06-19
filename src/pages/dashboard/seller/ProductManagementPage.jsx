import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getAllProducts, deleteProduct } from "../../../features/catalog/api/catalog.api";
import { getMyStore } from "../../../features/store/api/store.api";
import Button from "../../../shared/components/ui/Button";
import AlertModal from "../../../shared/components/ui/AlertModal";
import Spinner from "../../../shared/components/ui/Spinner";
import { CATEGORY_LABEL } from "../../../shared/constants/product";

const ProductManagementPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [successModal, setSuccessModal] = useState({ open: false, message: "" });

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
      setDeleteTarget(null);
      setSuccessModal({ open: true, message: "Produk berhasil dihapus!" });
    },
  });

  const products = productsData?.products || [];
  const total = productsData?.total || 0;

  return (
    <>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-text-primary">Produk</h1>
        <Button onClick={() => navigate("/dashboard/seller/products/create")} variant="primary">
          + Tambah Produk
        </Button>
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
          <Spinner size="lg" />
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
                <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wide pb-3 pr-4 hidden sm:table-cell">Kategori</th>
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
                    <span className="text-xs bg-brand-subtle text-text-primary px-2 py-0.5 rounded font-medium">
                      {CATEGORY_LABEL[product.category] || product.category}
                    </span>
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
                      <Button
                        onClick={() => navigate(`/dashboard/seller/products/${product.id}/edit`)}
                        variant="ghost"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => setDeleteTarget(product)}
                        variant="danger"
                        size="sm"
                      >
                        Hapus
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AlertModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        icon="🗑️"
        title="Hapus Produk"
        message={`Yakin ingin menghapus "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        actionLabel="Hapus"
        onAction={() => deleteMutation.mutate(deleteTarget.id)}
      />

      <AlertModal
        isOpen={successModal.open}
        onClose={() => setSuccessModal({ open: false, message: "" })}
        icon="✅"
        title="Berhasil"
        message={successModal.message}
      />
    </>
  );
};

export default ProductManagementPage;
