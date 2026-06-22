import React, { useState } from "react";
import { useAdminStores, useToggleStoreActive } from "../../../features/admin/hooks/useAdmin";
import ErrorState from "../../../shared/components/ui/ErrorState";
import Spinner from "../../../shared/components/ui/Spinner";
import Button from "../../../shared/components/ui/Button";

const AdminStoresPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useAdminStores(page);
  const toggleActive = useToggleStoreActive();

  const stores: any[] = data?.data ?? [];
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
      <ErrorState message="Gagal memuat toko." onRetry={() => window.location.reload()} />
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-text-primary mb-1">Toko</h1>
      <p className="text-sm text-text-muted mb-6">Daftar seluruh toko di Seapedia</p>

      <div className="card">
        {stores.length === 0 ? (
          <p className="text-sm text-text-secondary text-center py-6">Belum ada toko.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-border text-left text-text-muted">
                  <th className="pb-2 pr-3 font-semibold">Nama Toko</th>
                  <th className="pb-2 pr-3 font-semibold">Pemilik</th>
                  <th className="pb-2 pr-3 font-semibold">Produk</th>
                  <th className="pb-2 pr-3 font-semibold">Pesanan</th>
                  <th className="pb-2 pr-3 font-semibold">Status</th>
                  <th className="pb-2 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((s: any) => (
                  <tr key={s.id} className="border-b border-border hover:bg-brand-subtle transition-colors">
                    <td className="py-2.5 pr-3 font-medium text-text-primary">{s.storeName}</td>
                    <td className="py-2.5 pr-3 text-text-secondary">{s.user?.username || "-"}</td>
                    <td className="py-2.5 pr-3 text-text-secondary">{s._count?.products ?? 0}</td>
                    <td className="py-2.5 pr-3 text-text-secondary">{s._count?.orders ?? 0}</td>
                    <td className="py-2.5 pr-3">
                      <span className={`text-xs font-bold ${s.isActive ? "text-success" : "text-danger"}`}>
                        {s.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <button
                        onClick={() => toggleActive.mutate(s.id)}
                        disabled={toggleActive.isPending}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-2 transition-colors ${
                          s.isActive
                            ? "border-danger text-danger hover:bg-danger hover:text-white"
                            : "border-success text-success hover:bg-success hover:text-white"
                        }`}
                      >
                        {s.isActive ? "Nonaktifkan" : "Aktifkan"}
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

export default AdminStoresPage;
