import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useMyStore } from "../../../features/store/hooks/useMyStore";
import { useSellerProducts } from "../../../features/catalog/hooks/useProductMutations";
import { useSellerOrders } from "../../../features/order/hooks/useOrders";
import ErrorState from "../../../shared/components/ui/ErrorState";
import Spinner from "../../../shared/components/ui/Spinner";
import StatCard from "../../../shared/components/ui/StatCard";
import LowStockAlerts from "./components/LowStockAlerts";
import TopSellingProducts from "./components/TopSellingProducts";
import RevenueLineChart from "./components/RevenueLineChart";

const SellerDashboardPage: React.FC = () => {
  const { data: store, isLoading: storeLoading } = useMyStore() as any;
  const { data: productsData, isLoading: productsLoading } = useSellerProducts(store?.id ?? "") as any;
  const { data: orders = [], isLoading: ordersLoading, error } = useSellerOrders({ orderBy: "desc" }) as any;

  const stats = useMemo(() => {
    const pending = orders.filter((o: any) => o.status === "PENDING").length;
    const totalRevenue = orders
      .filter((o: any) => o.status === "DELIVERED")
      .reduce((sum: number, o: any) => sum + ((o as any).totalPrice ?? o.subtotal ?? 0), 0);
    return { pending, totalRevenue };
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
      <p className="text-sm text-text-muted mb-6">Ringkasan toko Anda</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <StatCard
          label="Total Pendapatan"
          value={`Rp${stats.totalRevenue.toLocaleString("id-ID")}`}
          variant="badge"
          color="bg-success"
        />
        <StatCard
          label="Perlu Diproses"
          value={stats.pending}
          variant="badge"
          color={stats.pending > 0 ? "bg-warning" : "bg-gray-400"}
        />
      </div>

      {stats.pending > 0 && (
        <div className="card !p-5 border-l-[4px] border-warning mb-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <LowStockAlerts products={productsData?.products ?? []} />
        <TopSellingProducts orders={orders} />
      </div>

      <RevenueLineChart orders={orders} />
    </>
  );
};

export default SellerDashboardPage;
