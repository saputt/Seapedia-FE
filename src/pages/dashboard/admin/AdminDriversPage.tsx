import React, { useState, useMemo } from "react";
import { useAdminDrivers, useToggleDriverSuspend } from "../../../features/admin/hooks/useAdmin";
import useDebounce from "../../../shared/hooks/useDebounce";
import ErrorState from "../../../shared/components/ui/ErrorState";
import Spinner from "../../../shared/components/ui/Spinner";
import Button from "../../../shared/components/ui/Button";
import Icon from "../../../shared/components/ui/Icon";

const AdminDriversPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useAdminDrivers(page);
  const toggleSuspend = useToggleDriverSuspend();

  const [confirmTarget, setConfirmTarget] = useState<{ id: string; currentSuspended: boolean } | null>(null);
  const [reason, setReason] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const drivers: any[] = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const filteredDrivers = useMemo(() => {
    if (!debouncedSearch.trim()) return drivers;
    const q = debouncedSearch.toLowerCase();
    return drivers.filter(
      (d) =>
        d.username?.toLowerCase().includes(q) ||
        d.email?.toLowerCase().includes(q),
    );
  }, [drivers, debouncedSearch]);

  const handleConfirm = () => {
    if (!confirmTarget) return;
    toggleSuspend.mutate(
      { id: confirmTarget.id, reason: confirmTarget.currentSuspended ? undefined : reason },
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
      <ErrorState message="Gagal memuat driver." onRetry={() => window.location.reload()} />
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-text-primary mb-1">Driver</h1>
      <p className="text-sm text-text-muted mb-6">Daftar seluruh driver di Seapedia</p>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Cari berdasarkan username atau email..."
        className="input-neo w-full max-w-sm mb-4"
      />

      <div className="card">
        {filteredDrivers.length === 0 ? (
          <p className="text-sm text-text-secondary text-center py-6">
            {search ? "Tidak ditemukan driver." : "Belum ada driver."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-border text-left text-text-muted">
                  <th className="pb-2 pr-3 font-semibold">Username</th>
                  <th className="pb-2 pr-3 font-semibold">Email</th>
                  <th className="pb-2 pr-3 font-semibold">Pesanan Dikirim</th>
                  <th className="pb-2 pr-3 font-semibold">Saldo</th>
                  <th className="pb-2 pr-3 font-semibold">Status</th>
                  <th className="pb-2 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map((d: any) => (
                  <tr key={d.id} className="border-b border-border hover:bg-brand-subtle transition-colors">
                    <td className="py-2.5 pr-3 font-medium text-text-primary">{d.username}</td>
                    <td className="py-2.5 pr-3 text-text-secondary">{d.email}</td>
                    <td className="py-2.5 pr-3 text-text-secondary">{d._count?.driverJobs ?? 0}</td>
                    <td className="py-2.5 pr-3 text-text-secondary">Rp{(d.wallet?.balance ?? 0).toLocaleString("id-ID")}</td>
                    <td className="py-2.5 pr-3">
                      <span className={`text-xs font-semibold ${d.isSuspended ? "text-danger" : "text-success"}`}>
                        {d.isSuspended ? "Disuspen" : "Aktif"}
                      </span>
                      {d.suspensionReason && d.isSuspended && (
                        <span className="block text-xs text-text-muted mt-0.5" title={d.suspensionReason}>
                          {d.suspensionReason.length > 30 ? d.suspensionReason.slice(0, 30) + "..." : d.suspensionReason}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5">
                      <Button
                        onClick={() => setConfirmTarget({ id: d.id, currentSuspended: d.isSuspended })}
                        variant={d.isSuspended ? "primary" : "primary"}
                        size="sm"
                      >
                        {d.isSuspended ? "Aktifkan" : "Suspen"}
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
            {confirmTarget.currentSuspended ? (
              <>
                <div className="mb-4 flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-brand-deep flex items-center justify-center">
                    <Icon name="check" size={28} className="text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">Aktifkan Driver</h3>
                <p className="text-text-secondary mb-6 leading-relaxed">
                  Driver ini akan aktif kembali dan dapat mengambil pesanan lagi.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Button onClick={() => setConfirmTarget(null)} variant="ghost" size="sm">
                    Batal
                  </Button>
                  <Button onClick={handleConfirm} variant="primary" size="sm" loading={toggleSuspend.isPending}>
                    Aktifkan
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4 flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-brand-deep flex items-center justify-center">
                    <Icon name="close" size={28} className="text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">Suspen Driver</h3>
                <p className="text-text-secondary mb-4 leading-relaxed">
                  Driver yang disuspen tidak dapat mengambil pesanan baru.
                </p>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Alasan suspensi (opsional)"
                  className="input-neo w-full mb-4 min-h-[80px] resize-y text-sm"
                />
                <div className="flex items-center justify-center gap-3">
                  <Button onClick={() => { setConfirmTarget(null); setReason(""); }} variant="ghost" size="sm">
                    Batal
                  </Button>
                  <Button onClick={handleConfirm} variant="primary" size="sm" loading={toggleSuspend.isPending}>
                    Suspen
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

export default AdminDriversPage;
