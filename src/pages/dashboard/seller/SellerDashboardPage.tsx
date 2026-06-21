import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useMyStore } from "../../../features/store/hooks/useMyStore";
import { useSellerProducts } from "../../../features/catalog/hooks/useProductMutations";
import { useSellerOrders } from "../../../features/order/hooks/useOrders";
import ErrorState from "../../../shared/components/ui/ErrorState";
import Spinner from "../../../shared/components/ui/Spinner";
import StatCard from "../../../shared/components/ui/StatCard";
import TopSellingProducts from "./components/TopSellingProducts";
import LowStockAlerts from "./components/LowStockAlerts";
import RecentOrdersFeed from "./components/RecentOrdersFeed";
import AverageRatingCard from "./components/AverageRatingCard";

const SellerDashboardPage: React.FC = () => {
  const { data: store, isLoading: storeLoading } = useMyStore() as any;

  const { data: productsData, isLoading: productsLoading } = useSellerProducts(store?.id ?? "") as any;

  const { data: orders = [], isLoading: ordersLoading, error } = useSellerOrders(
    { orderBy: "desc" }
  ) as any;

  const stats = useMemo(() => {
    const pending = orders.filter((o: any) => o.status === "PENDING").length;
    const ready = orders.filter((o: any) => o.status === "READY_FOR_DELIVERY").length;
    const onDelivery = orders.filter((o: any) => o.status === "ON_DELIVERY").length;
    const delivered = orders.filter((o: any) => o.status === "DELIVERED").length;
    const cancelled = orders.filter((o: any) => o.status === "CANCELLED").length;

    const totalRevenue = orders
      .filter((o: any) => o.status === "DELIVERED")
      .reduce((sum: number, o: any) => sum + (o.subtotal - o.discountValue), 0);

    return {
      totalOrders: orders.length,
      pending,
      ready: ready + onDelivery,
      delivered,
      cancelled,
      totalRevenue,
    };
  }, [orders]);

  const isLoading = storeLoading || productsLoading || ordersLoading;

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
        <ErrorState message="Gagal memuat data dashboard." onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-text-primary mb-1">Dashboard</h1>
      <p className="text-sm text-text-muted mb-8">Ringkasan toko Anda</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Produk" value={store ? (productsData?.total ?? 0) : 0} variant="badge" color="bg-blue-500" />
        <StatCard label="Total Pesanan" value={stats.totalOrders} variant="badge" color="bg-brand-deep" />
        <StatCard label="Pendapatan" value={`Rp${stats.totalRevenue.toLocaleString("id-ID")}`} variant="badge" color="bg-success" />
        <StatCard label="Perlu Diproses" value={stats.pending} variant="badge" color="bg-warning" />
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

      <h2 className="text-lg font-bold text-text-primary mt-10 mb-4">Analitik</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopSellingProducts orders={orders} />
        <AverageRatingCard products={productsData?.products ?? []} />
        <RecentOrdersFeed orders={orders} />
        <LowStockAlerts products={productsData?.products ?? []} />
      </div>
    </>
  );
};

export default SellerDashboardPage;
