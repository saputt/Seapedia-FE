import React, { useState, useMemo } from "react";
import { useAdminUsers } from "../../../features/admin/hooks/useAdmin";
import ErrorState from "../../../shared/components/ui/ErrorState";
import Spinner from "../../../shared/components/ui/Spinner";
import Button from "../../../shared/components/ui/Button";

const AdminUsersPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useAdminUsers(page);

  const users: any[] = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.username?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q),
    );
  }, [users, search]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState message="Gagal memuat pengguna." onRetry={() => window.location.reload()} />
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-text-primary mb-1">Pengguna</h1>
      <p className="text-sm text-text-muted mb-6">Daftar seluruh pengguna Seapedia</p>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari berdasarkan nama atau email..."
          className="input-neo w-full max-w-sm"
        />
      </div>

      <div className="card">
        {filteredUsers.length === 0 ? (
          <p className="text-sm text-text-secondary text-center py-6">
            {search ? "Tidak ditemukan pengguna." : "Belum ada pengguna."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-border text-left text-text-muted">
                  <th className="pb-2 pr-3 font-semibold">Nama</th>
                  <th className="pb-2 pr-3 font-semibold">Email</th>
                  <th className="pb-2 pr-3 font-semibold">Role</th>
                  <th className="pb-2 pr-3 font-semibold">Toko</th>
                  <th className="pb-2 pr-3 font-semibold">Saldo</th>
                  <th className="pb-2 pr-3 font-semibold">Status</th>
                  <th className="pb-2 font-semibold">Bergabung</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u: any) => (
                  <tr
                    key={u.id}
                    className="border-b border-border hover:bg-brand-subtle transition-colors"
                  >
                    <td className="py-2.5 pr-3 font-medium text-text-primary">
                      {u.username || "-"}
                    </td>
                    <td className="py-2.5 pr-3 text-text-secondary">
                      {u.email || "-"}
                    </td>
                    <td className="py-2.5 pr-3">
                      <div className="flex flex-wrap gap-1">
                        {(u.roles || []).map((r: any) => (
                          <span
                            key={r.roleName}
                            className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-subtle text-brand-deep"
                          >
                            {r.roleName}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 pr-3 text-text-secondary">
                      {u.store?.storeName || "-"}
                    </td>
                    <td className="py-2.5 pr-3 font-semibold text-text-primary">
                      Rp{(u.wallet?.balance ?? 0).toLocaleString("id-ID")}
                    </td>
                    <td className="py-2.5 pr-3">
                      <span className="text-xs font-bold text-success">Aktif</span>
                    </td>
                    <td className="py-2.5 text-text-muted text-xs">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString("id-ID")
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!search && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              variant="ghost"
              disabled={page <= 1}
            >
              Sebelumnya
            </Button>
            <span className="text-sm text-text-muted">
              Halaman {page} dari {totalPages}
            </span>
            <Button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              variant="ghost"
              disabled={page >= totalPages}
            >
              Selanjutnya
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminUsersPage;
