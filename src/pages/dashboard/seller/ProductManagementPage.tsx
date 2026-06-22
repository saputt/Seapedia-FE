import React, { useState, useMemo } from "react";
import { useMyStore } from "../../../features/store/hooks/useMyStore";
import { useSellerProducts, useDeleteProduct } from "../../../features/catalog/hooks/useProductMutations";
import { useNavigate } from "react-router-dom";
import Button from "../../../shared/components/ui/Button";
import AlertModal from "../../../shared/components/ui/AlertModal";
import Spinner from "../../../shared/components/ui/Spinner";
import { CATEGORY_SHORT, CATEGORIES } from "../../../shared/constants/product";
import type { Product, ProductCategory } from "../../../types";

const ProductManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | "ALL">("ALL");
  const [deleteTarget, setDeleteTarget] = useState<Pick<Product, "id" | "name"> | null>(null);
  const [successModal, setSuccessModal] = useState<{ open: boolean; message: string }>({ open: false, message: "" });

  const { data: store } = useMyStore() as any;
  const { data: productsData, isLoading } = useSellerProducts(store?.id ?? "", search) as any;
  const deleteMutation = useDeleteProduct();

  const allProducts = productsData?.products || [];
  const total = productsData?.total || 0;

  const products = useMemo(() => {
    if (categoryFilter === "ALL") return allProducts;
    return allProducts.filter((p: Product) => p.category === categoryFilter);
  }, [allProducts, categoryFilter]);

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
        setSuccessModal({ open: true, message: "Produk berhasil dihapus!" });
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        className="input-neo w-full max-w-sm mb-4"
        placeholder="Cari produk..."
      />

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setCategoryFilter("ALL")}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full border-3 transition-colors ${
            categoryFilter === "ALL"
              ? "bg-brand-deep text-white border-brand-deep"
              : "border-border bg-white text-text-secondary hover:bg-brand-subtle"
          }`}
        >
          Semua
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategoryFilter(cat.key)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border-3 transition-colors ${
              categoryFilter === cat.key
                ? "bg-brand-deep text-white border-brand-deep"
                : "border-border bg-white text-text-secondary hover:bg-brand-subtle"
            }`}
          >
            {CATEGORY_SHORT[cat.key]}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {!isLoading && products.length === 0 && (
        <div className="card !p-8 text-center">
          <p className="text-text-muted">
            {search || categoryFilter !== "ALL"
              ? "Produk tidak ditemukan"
              : "Belum ada produk. Tambahkan produk pertama Anda!"}
          </p>
        </div>
      )}

      {!isLoading && products.length > 0 && (
        <>
          {/* Desktop: table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-[3px] border-bg-tertiary">
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wide pb-3 pr-4">Produk</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wide pb-3 pr-4">Kategori</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wide pb-3 pr-4">Harga</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wide pb-3 pr-4">Stok</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wide pb-3 pr-4">Status</th>
                  <th className="text-right text-xs font-semibold text-text-muted uppercase tracking-wide pb-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: Product) => (
                  <tr key={product.id} className="border-b-[2px] border-bg-tertiary/50 hover:bg-brand-subtle/30 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-bg-tertiary rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} loading="lazy" className="w-full h-full object-cover" />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <path d="M21 15l-5-5L5 21" />
                            </svg>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">{product.name}</p>
                          <p className="text-xs text-text-muted truncate">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-xs bg-brand-subtle text-text-primary px-2 py-0.5 rounded font-medium">
                        {CATEGORY_SHORT[product.category] || product.category}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <p className="text-sm font-semibold text-text-primary">Rp{product.price?.toLocaleString("id-ID")}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-sm font-medium ${product.stock > 0 ? "text-success" : "text-danger"}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      {(product as any).isHidden ? (
                        <span className="text-xs font-bold text-warning bg-bg-tertiary px-2 py-0.5 rounded">
                          Disuspen
                        </span>
                      ) : (
                        <span className="text-xs text-text-muted">-</span>
                      )}
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

          {/* Mobile: card list */}
          <div className="sm:hidden space-y-3">
            {products.map((product: Product) => (
              <div key={product.id} className="card !p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-bg-tertiary rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] bg-brand-subtle text-text-primary px-1.5 py-0.5 rounded font-medium">
                        {CATEGORY_SHORT[product.category] || product.category}
                      </span>
                      {(product as any).isHidden && (
                        <span className="text-[10px] font-bold text-warning bg-bg-tertiary px-1.5 py-0.5 rounded">
                          Disuspen
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-text-primary">Rp{product.price?.toLocaleString("id-ID")}</p>
                    <p className={`text-xs font-medium ${product.stock > 0 ? "text-success" : "text-danger"}`}>
                      Stok: {product.stock}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t-2 border-border-default">
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
              </div>
            ))}
          </div>
        </>
      )}

      <AlertModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        icon="🗑️"
        title="Hapus Produk"
        message={`Yakin ingin menghapus "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        actionLabel="Hapus"
        onAction={handleDelete}
      />

      <AlertModal
        isOpen={successModal.open}
        onClose={() => setSuccessModal({ open: false, message: "" })}
        icon="✅"
        title="Berhasil"
        message={successModal.message}
      />
    </div>
  );
};

export default ProductManagementPage;
