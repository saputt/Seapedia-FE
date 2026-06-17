import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "../../../shared/components/layout/MainLayout";
import { getMyStore } from "../../../features/store/api/store.api";
import { getSellerOrders } from "../../../features/order/api/order.api";
import { getAllProducts } from "../../../features/catalog/api/catalog.api";
import { STATUS_LABEL } from "../../../shared/constants/order";

const sidebarLinks = [
  { to: "/dashboard/seller", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { to: "/dashboard/seller/store", label: "Toko Saya", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { to: "/dashboard/seller/products", label: "Produk", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { to: "/dashboard/seller/orders", label: "Pesanan", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
];

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
  const location = useLocation();

  const { data: store, isLoading: storeLoading } = useQuery({
    queryKey: ["myStore"],
    queryFn: getMyStore,
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["sellerOrders"],
    queryFn: () => getSellerOrders({ orderBy: "dsc" }),
    enabled: !!store,
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["storeProducts", store?.id],
    queryFn: () => getAllProducts({ storeId: store.id, limit: 1 }),
    enabled: !!store?.id,
  });

  const stats = useMemo(() => {
    if (!orders.length) {
      return {
        totalOrders: 0,
        pending: 0,
        ready: 0,
        delivered: 0,
        cancelled: 0,
        totalRevenue: 0,
        totalProducts: productsData?.total || 0,
      };
    }

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
      totalProducts: productsData?.total || 0,
    };
  }, [orders, productsData]);

  const isLoading = storeLoading || ordersLoading || productsLoading;

  if (isLoading) {
    return (
      <MainLayout navbarVariant="default">
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-[3px] border-brand-deep border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout navbarVariant="default">
      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside className="w-60 shrink-0 border-r-[3px] border-bg-tertiary bg-bg-secondary hidden lg:block">
          <div className="p-5 border-b-[3px] border-bg-tertiary">
            <h2 className="font-bold text-text-primary truncate">{store?.storeName || "Toko Saya"}</h2>
            <p className="text-xs text-text-muted">Dashboard Penjual</p>
          </div>
          <nav className="p-3 space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = link.to === location.pathname;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-deep text-white"
                      : "text-text-secondary hover:text-brand-deep hover:bg-brand-subtle"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={link.icon} />
                  </svg>
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1 p-6 lg:p-8 overflow-auto">
          <h1 className="text-2xl font-bold text-text-primary mb-1">Dashboard</h1>
          <p className="text-sm text-text-muted mb-8">Ringkasan toko Anda</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Produk" value={stats.totalProducts} color="bg-blue-500" />
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
                  className="btn-primary text-sm !py-2 !px-4"
                >
                  Proses Sekarang
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default SellerDashboardPage;
