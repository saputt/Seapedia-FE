import React, { useState } from "react";
import { useAdminProducts, useToggleProductHidden } from "../../../features/admin/hooks/useAdmin";
import ErrorState from "../../../shared/components/ui/ErrorState";
import Spinner from "../../../shared/components/ui/Spinner";
import Button from "../../../shared/components/ui/Button";

const AdminProductsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useAdminProducts(page);
  const toggleHidden = useToggleProductHidden();

  const products: any[] = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState message="Gagal memuat produk." onRetry={() => window.location.reload()} />
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-text-primary mb-1">Produk</h1>
      <p className="text-sm text-text-muted mb-6">Daftar seluruh produk di Seapedia</p>

      <div className="card">
        {products.length === 0 ? (
          <p className="text-sm text-text-secondary text-center py-6">Belum ada produk.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-border text-left text-text-muted">
                  <th className="pb-2 pr-3 font-semibold">Nama</th>
                  <th className="pb-2 pr-3 font-semibold">Toko</th>
                  <th className="pb-2 pr-3 font-semibold">Harga</th>
                  <th className="pb-2 pr-3 font-semibold">Stok</th>
                  <th className="pb-2 pr-3 font-semibold">Terjual</th>
                  <th className="pb-2 pr-3 font-semibold">Status</th>
                  <th className="pb-2 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p: any) => (
                  <tr key={p.id} className="border-b border-border hover:bg-brand-subtle transition-colors">
                    <td className="py-2.5 pr-3 font-medium text-text-primary">{p.name}</td>
                    <td className="py-2.5 pr-3 text-text-secondary">{p.store?.storeName || "-"}</td>
                    <td className="py-2.5 pr-3 font-semibold text-text-primary">Rp{p.price?.toLocaleString("id-ID")}</td>
                    <td className="py-2.5 pr-3 text-text-secondary">{p.stock}</td>
                    <td className="py-2.5 pr-3 text-text-secondary">{p._count?.orderItems ?? 0}</td>
                    <td className="py-2.5 pr-3">
                      <span className={`text-xs font-bold ${p.isHidden ? "text-danger" : "text-success"}`}>
                        {p.isHidden ? "Tersembunyi" : "Tampil"}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <button
                        onClick={() => toggleHidden.mutate(p.id)}
                        disabled={toggleHidden.isPending}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-2 transition-colors ${
                          p.isHidden
                            ? "border-success text-success hover:bg-success hover:text-white"
                            : "border-warning text-warning hover:bg-warning hover:text-white"
                        }`}
                      >
                        {p.isHidden ? "Tampilkan" : "Sembunyikan"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <Button onClick={() => setPage((p) => Math.max(1, p - 1))} variant="ghost" disabled={page <= 1}>
              Sebelumnya
            </Button>
            <span className="text-sm text-text-muted">Halaman {page} dari {totalPages}</span>
            <Button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} variant="ghost" disabled={page >= totalPages}>
              Selanjutnya
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminProductsPage;
