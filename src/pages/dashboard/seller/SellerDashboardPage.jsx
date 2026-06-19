import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useMyStore } from "../../../features/store/hooks/useMyStore";
import { useSellerOrders } from "../../../features/order/hooks/useOrders";
import Button from "../../../shared/components/ui/Button";
import Spinner from "../../../shared/components/ui/Spinner";

const StatCard = ({ label, value, color }) => (
  <div className="card !p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
      <span className="text-white text-lg font-bold">{value}</span>
    </div>
    <div>
      <p className="text-sm text-text-muted">{label}</p>
      <p className="text-xl font-bold text-text-primary">{value}</p>
    </div>
  </div>
);

const SellerDashboardPage = () => {
  const { data: store, isLoading: storeLoading } = useMyStore();

  const { data: orders = [], isLoading: ordersLoading, error } = useSellerOrders(
    { orderBy: "desc" }
  );

  const stats = useMemo(() => {
    const pending = orders.filter((o) => o.status === "PENDING").length;
    const ready = orders.filter((o) => o.status === "READY_FOR_DELIVERY").length;
    const onDelivery = orders.filter((o) => o.status === "ON_DELIVERY").length;
    const delivered = orders.filter((o) => o.status === "DELIVERED").length;
    const cancelled = orders.filter((o) => o.status === "CANCELLED").length;

    const totalRevenue = orders
      .filter((o) => o.status === "DELIVERED")
      .reduce((sum, o) => sum + (o.subtotal - o.discountValue), 0);

    return {
      totalOrders: orders.length,
      pending,
      ready: ready + onDelivery,
      delivered,
      cancelled,
      totalRevenue,
    };
  }, [orders]);

  const isLoading = storeLoading || ordersLoading;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">Dashboard</h1>
        <p className="text-sm text-text-muted mb-8">Ringkasan toko Anda</p>
        <div className="card text-center py-10">
          <p className="text-danger font-semibold mb-4">Gagal memuat data dashboard.</p>
          <Button onClick={() => window.location.reload()} variant="primary" size="sm">
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-text-primary mb-1">Dashboard</h1>
      <p className="text-sm text-text-muted mb-8">Ringkasan toko Anda</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Produk" value={store ? "—" : 0} color="bg-blue-500" />
        <StatCard label="Total Pesanan" value={stats.totalOrders} color="bg-brand-deep" />
        <StatCard label="Pendapatan" value={`Rp${stats.totalRevenue.toLocaleString("id-ID")}`} color="bg-success" />
        <StatCard label="Perlu Diproses" value={stats.pending} color="bg-warning" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card !p-4">
          <p className="text-xs text-text-muted mb-1">Siap Dikirim</p>
          <p className="text-lg font-bold text-text-primary">{stats.ready}</p>
        </div>
        <div className="card !p-4">
          <p className="text-xs text-text-muted mb-1">Selesai</p>
          <p className="text-lg font-bold text-text-primary">{stats.delivered}</p>
        </div>
        <div className="card !p-4">
          <p className="text-xs text-text-muted mb-1">Dibatalkan</p>
          <p className="text-lg font-bold text-text-primary">{stats.cancelled}</p>
        </div>
      </div>

      {stats.pending > 0 && (
        <div className="card !p-5 border-l-[4px] border-warning">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-text-primary">Pesanan Perlu Diproses</p>
              <p className="text-sm text-text-muted mt-1">
                Ada {stats.pending} pesanan menunggu konfirmasi Anda
              </p>
            </div>
            <Link
              to="/dashboard/seller/orders"
              className="btn-primary text-sm !py-2 !px-4 inline-block"
            >
              Proses Sekarang
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default SellerDashboardPage;
