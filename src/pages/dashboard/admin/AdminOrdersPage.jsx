import { useState } from "react";
import { useAdminOrders } from "../../../features/admin/hooks/useAdmin";
import { STATUS_LABEL, STATUS_COLOR, SHIPPING_LABEL } from "../../../shared/constants/order";

const PAGE_SIZE = 10;

const AdminOrdersPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useAdminOrders(page);
  const orders = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-[3px] border-brand-deep border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center py-10">
        <p className="text-danger font-semibold mb-4">Gagal memuat pesanan.</p>
        <button onClick={() => window.location.reload()} className="btn-primary text-sm !py-2 !px-6">
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-text-primary mb-1">Semua Pesanan</h1>
      <p className="text-sm text-text-muted mb-6">Kelola seluruh pesanan di Seapedia</p>

      <div className="card">
        {orders.length === 0 ? (
          <p className="text-sm text-text-secondary text-center py-6">Belum ada pesanan.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-border text-left text-text-muted">
                  <th className="pb-2 pr-3 font-semibold">ID</th>
                  <th className="pb-2 pr-3 font-semibold">Pembeli</th>
                  <th className="pb-2 pr-3 font-semibold">Toko</th>
                  <th className="pb-2 pr-3 font-semibold">Status</th>
                  <th className="pb-2 pr-3 font-semibold">Total</th>
                  <th className="pb-2 pr-3 font-semibold">Pengiriman</th>
                  <th className="pb-2 font-semibold">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-border hover:bg-brand-subtle transition-colors">
                    <td className="py-2.5 pr-3 font-mono text-xs text-text-secondary">#{o.id?.slice(0, 8)}</td>
                    <td className="py-2.5 pr-3 font-medium text-text-primary">{o.buyer?.username || "-"}</td>
                    <td className="py-2.5 pr-3 text-text-secondary">{o.store?.storeName || "-"}</td>
                    <td className="py-2.5 pr-3">
                      <span className={`text-xs font-bold ${STATUS_COLOR[o.status] || "text-text-secondary"}`}>
                        {STATUS_LABEL[o.status] || o.status}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 font-semibold text-text-primary">Rp{o.totalPrice?.toLocaleString("id-ID")}</td>
                    <td className="py-2.5 pr-3 text-text-secondary">{SHIPPING_LABEL[o.shippingMethod] || o.shippingMethod}</td>
                    <td className="py-2.5 text-text-muted text-xs">
                      {new Date(o.createdAt).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className={`text-sm font-semibold !py-1.5 !px-4 ${page <= 1 ? "opacity-40 cursor-not-allowed" : ""} btn-ghost`}
            >
              Sebelumnya
            </button>
            <span className="text-sm text-text-muted">
              Halaman {page} dari {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className={`text-sm font-semibold !py-1.5 !px-4 ${page >= totalPages ? "opacity-40 cursor-not-allowed" : ""} btn-ghost`}
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminOrdersPage;
