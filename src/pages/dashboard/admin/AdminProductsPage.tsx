import React, { useState } from "react";
import { useAdminProducts, useToggleProductHidden } from "../../../features/admin/hooks/useAdmin";
import ErrorState from "../../../shared/components/ui/ErrorState";
import Spinner from "../../../shared/components/ui/Spinner";
import Button from "../../../shared/components/ui/Button";
import Icon from "../../../shared/components/ui/Icon";

const AdminProductsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useAdminProducts(page);
  const toggleHidden = useToggleProductHidden();

  const [confirmTarget, setConfirmTarget] = useState<{ id: string; currentHidden: boolean } | null>(null);

  const products: any[] = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleConfirm = () => {
    if (!confirmTarget) return;
    toggleHidden.mutate(confirmTarget.id, {
      onSettled: () => setConfirmTarget(null),
    });
  };

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
                      <span className={`text-xs font-semibold ${p.isHidden ? "text-warning" : "text-success"}`}>
                        {p.isHidden ? "Tersembunyi" : "Tampil"}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <Button
                        onClick={() => setConfirmTarget({ id: p.id, currentHidden: p.isHidden })}
                        variant={p.isHidden ? "primary" : "ghost"}
                        size="sm"
                      >
                        {p.isHidden ? "Tampilkan" : "Sembunyikan"}
                      </Button>
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

      {confirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => setConfirmTarget(null)}>
          <div className="card max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
            {confirmTarget.currentHidden ? (
              <>
                <div className="mb-4 flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-brand-deep flex items-center justify-center">
                    <Icon name="check" size={28} className="text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">Tampilkan Produk</h3>
                <p className="text-text-secondary mb-6 leading-relaxed">
                  Produk ini akan tampil kembali dan bisa dilihat oleh pembeli.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Button onClick={() => setConfirmTarget(null)} variant="ghost" size="sm">Batal</Button>
                  <Button onClick={handleConfirm} variant="primary" size="sm" loading={toggleHidden.isPending}>Tampilkan</Button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4 flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-brand-deep flex items-center justify-center">
                    <Icon name="close" size={28} className="text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">Sembunyikan Produk</h3>
                <p className="text-text-secondary mb-6 leading-relaxed">
                  Produk ini akan disembunyikan dari semua pembeli.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Button onClick={() => setConfirmTarget(null)} variant="ghost" size="sm">Batal</Button>
                  <Button onClick={handleConfirm} variant="primary" size="sm" loading={toggleHidden.isPending}>Sembunyikan</Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProductsPage;
