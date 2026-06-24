import React, { useState, useMemo } from "react";
import { useAdminStores, useToggleStoreActive } from "../../../features/admin/hooks/useAdmin";
import useDebounce from "../../../shared/hooks/useDebounce";
import ErrorState from "../../../shared/components/ui/ErrorState";
import Spinner from "../../../shared/components/ui/Spinner";
import Button from "../../../shared/components/ui/Button";

const AdminStoresPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useAdminStores(page);
  const toggleActive = useToggleStoreActive();

  const [confirmTarget, setConfirmTarget] = useState<{ id: string; currentActive: boolean } | null>(null);
  const [reason, setReason] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const stores: any[] = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const filteredStores = useMemo(() => {
    if (!debouncedSearch.trim()) return stores;
    const q = debouncedSearch.toLowerCase();
    return stores.filter(
      (s) =>
        s.storeName?.toLowerCase().includes(q) ||
        s.user?.username?.toLowerCase().includes(q),
    );
  }, [stores, debouncedSearch]);

  const handleConfirm = () => {
    if (!confirmTarget) return;
    toggleActive.mutate(
      { id: confirmTarget.id, reason: confirmTarget.currentActive ? reason : undefined },
      { onSettled: () => { setConfirmTarget(null); setReason(""); } },
    );
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
      <ErrorState message="Gagal memuat toko." onRetry={() => window.location.reload()} />
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-text-primary mb-1">Toko</h1>
      <p className="text-sm text-text-muted mb-6">Daftar seluruh toko di Seapedia</p>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Cari berdasarkan nama toko atau pemilik..."
        className="input-neo w-full max-w-sm mb-4"
      />

      <div className="card">
        {filteredStores.length === 0 ? (
          <p className="text-sm text-text-secondary text-center py-6">
            {search ? "Tidak ditemukan toko." : "Belum ada toko."}
          </p>
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
                {filteredStores.map((s: any) => (
                  <tr key={s.id} className="border-b border-border hover:bg-brand-subtle transition-colors">
                    <td className="py-2.5 pr-3 font-medium text-text-primary">{s.storeName}</td>
                    <td className="py-2.5 pr-3 text-text-secondary">{s.user?.username || "-"}</td>
                    <td className="py-2.5 pr-3 text-text-secondary">{s._count?.products ?? 0}</td>
                    <td className="py-2.5 pr-3 text-text-secondary">{s._count?.orders ?? 0}</td>
                    <td className="py-2.5 pr-3">
                      <span className={`text-xs font-semibold ${s.isActive ? "text-success" : "text-danger"}`}>
                        {s.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <Button
                        onClick={() => setConfirmTarget({ id: s.id, currentActive: s.isActive })}
                        variant={s.isActive ? "danger" : "primary"}
                        size="sm"
                      >
                        {s.isActive ? "Nonaktifkan" : "Aktifkan"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!search && totalPages > 1 && (
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
            {confirmTarget.currentActive ? (
              <>
                <div className="text-5xl mb-4">⛔</div>
                <h3 className="text-xl font-bold text-text-primary mb-2">Nonaktifkan Toko</h3>
                <p className="text-text-secondary mb-4 leading-relaxed">
                  Yakin ingin menonaktifkan toko ini? Produk dari toko ini tidak akan tampil di pembeli.
                </p>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Alasan penonaktifan (opsional)"
                  className="input-neo w-full mb-4 min-h-[80px] resize-y text-sm"
                />
                <div className="flex items-center justify-center gap-3">
                  <Button onClick={() => { setConfirmTarget(null); setReason(""); }} variant="ghost" size="sm">
                    Batal
                  </Button>
                  <Button onClick={handleConfirm} variant="danger" size="sm" loading={toggleActive.isPending}>
                    Nonaktifkan
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-text-primary mb-2">Aktifkan Toko</h3>
                <p className="text-text-secondary mb-6 leading-relaxed">
                  Toko ini akan aktif kembali dan produknya akan tampil di pembeli.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Button onClick={() => setConfirmTarget(null)} variant="ghost" size="sm">
                    Batal
                  </Button>
                  <Button onClick={handleConfirm} variant="primary" size="sm" loading={toggleActive.isPending}>
                    Aktifkan
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminStoresPage;
