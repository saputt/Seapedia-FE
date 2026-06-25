import React from "react";
import { useNavigate } from "react-router-dom";
import { useAdminDashboard } from "../../../features/admin/hooks/useAdmin";
import { STATUS_LABEL } from "../../../shared/constants/order";
import ErrorState from "../../../shared/components/ui/ErrorState";
import Spinner from "../../../shared/components/ui/Spinner";
import StatCard from "../../../shared/components/ui/StatCard";
import type { AdminDashboardResponse, AdminRecentOrder } from "../../../types";

const AdminDashboardPage: React.FC = () => {
  const { data, isLoading, error } = useAdminDashboard();
  const navigate = useNavigate();
  const dashboardData = data as AdminDashboardResponse | undefined;
  const stats = dashboardData?.stats;
  const ordersByStatus: Record<string, number> = dashboardData?.ordersByStatus ?? {};
  const recentOrders: AdminRecentOrder[] = dashboardData?.recentOrders ?? [];

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message="Gagal memuat dashboard." onRetry={() => window.location.reload()} />;
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-text-primary mb-1">Dashboard Admin</h1>
      <p className="text-sm text-text-muted mb-6">Ringkasan sistem Seapedia</p>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        <StatCard label="Pengguna" value={stats?.totalUsers} color="text-brand-deep" />
        <StatCard label="Toko" value={stats?.totalStores} color="text-info" />
        <StatCard label="Produk" value={stats?.totalProducts} color="text-warning" />
        <StatCard label="Driver" value={stats?.totalDrivers} color="text-danger" />
        <StatCard label="Pesanan" value={stats?.totalOrders} color="text-text-primary" />
      </div>

      <div className="card mb-8">
        <h2 className="text-sm font-bold text-text-primary mb-3">Pesanan per Status</h2>
        <div className="space-y-2">
          {Object.entries(ordersByStatus).map(([status, count]) => (
            <div key={status} className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">{STATUS_LABEL[status] || status}</span>
              <span className="text-sm font-bold text-text-primary">{count}</span>
            </div>
          ))}
          {Object.keys(ordersByStatus).length === 0 && (
            <p className="text-sm text-text-muted text-center py-4">Belum ada pesanan.</p>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="text-sm font-bold text-text-primary mb-3">Pesanan Terbaru</h2>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-4">Belum ada pesanan.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-border text-left text-text-muted">
                  <th className="pb-2 pr-4 font-semibold">ID</th>
                  <th className="pb-2 pr-4 font-semibold">Pembeli</th>
                  <th className="pb-2 pr-4 font-semibold">Toko</th>
                  <th className="pb-2 pr-4 font-semibold">Total</th>
                  <th className="pb-2 font-semibold">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o: AdminRecentOrder) => (
                  <tr
                    key={o.id}
                    className="border-b border-border hover:bg-brand-subtle cursor-pointer transition-colors"
                    onClick={() => navigate(`/dashboard/admin/orders`)}
                  >
                    <td className="py-2.5 pr-4 font-mono text-xs text-text-secondary">#{o.id?.slice(0, 8)}</td>
                    <td className="py-2.5 pr-4 font-medium text-text-primary">{o.buyer?.username}</td>
                    <td className="py-2.5 pr-4 text-text-secondary">{o.store?.storeName}</td>
                    <td className="py-2.5 pr-4 font-semibold text-text-primary">Rp{o.totalPrice?.toLocaleString("id-ID")}</td>
                    <td className="py-2.5 text-text-muted text-xs">
                      {new Date(o.createdAt).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboardPage;
