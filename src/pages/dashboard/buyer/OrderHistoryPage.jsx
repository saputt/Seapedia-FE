import { useState } from "react";
import { Link } from "react-router";
import MainLayout from "../../../shared/components/layout/MainLayout";
import { useBuyerOrders, useCancelOrder } from "../../../features/order/hooks/useOrders";

const STATUS_COLOR = {
  PENDING: "text-warning",
  READY_FOR_DELIVERY: "text-info",
  ON_DELIVERY: "text-info",
  DELIVERED: "text-success",
  CANCELLED: "text-danger",
};

const STATUS_LABEL = {
  PENDING: "Menunggu Konfirmasi",
  READY_FOR_DELIVERY: "Siap Dikirim",
  ON_DELIVERY: "Dalam Pengiriman",
  DELIVERED: "Diterima",
  CANCELLED: "Dibatalkan",
};

const OrderHistoryPage = () => {
  const { data: orders = [], isLoading, error } = useBuyerOrders();
  const cancelMutation = useCancelOrder();
  const [filter, setFilter] = useState("ALL");
  const [cancellingId, setCancellingId] = useState(null);

  const statuses = ["ALL", ...new Set(orders.map((o) => o.status))];

  const filtered =
    filter === "ALL"
      ? orders
      : orders.filter((o) => o.status === filter);

  const handleCancel = async (orderId) => {
    setCancellingId(orderId);
    try {
      await cancelMutation.mutateAsync(orderId);
    } catch (e) { /* handled */ }
    setCancellingId(null);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <span className="w-8 h-8 border-[3px] border-brand-deep border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <div className="card text-center py-10">
            <p className="text-danger font-semibold mb-4">Gagal memuat pesanan.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary text-sm !py-2 !px-6"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-[720px] mx-auto w-full px-6 lg:px-8 py-8 space-y-6">
        <h1 className="text-xl font-bold text-text-primary">Riwayat Pesanan</h1>

        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                filter === s
                  ? "bg-brand-deep text-white border-brand-deep"
                  : "border-border bg-white text-text-secondary hover:bg-brand-subtle"
              }`}
            >
              {s === "ALL" ? "Semua" : (STATUS_LABEL[s] || s)}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="card text-center py-10">
            <p className="text-sm text-text-secondary">
              {filter === "ALL"
                ? "Belum ada pesanan."
                : `Tidak ada pesanan dengan status "${STATUS_LABEL[filter] || filter}".`}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {filtered.map((order) => (
            <Link
              key={order.id}
              to={`/dashboard/buyer/orders/${order.id}`}
              className="card block hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs text-text-muted">
                    {new Date(order.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={`text-xs font-bold ${STATUS_COLOR[order.status] || "text-text-secondary"}`}
                >
                  {STATUS_LABEL[order.status] || order.status}
                </span>
              </div>

              {order.store && (
                <p className="text-sm font-semibold text-text-primary mb-3">
                  {order.store.storeName}
                </p>
              )}

              <div className="space-y-2">
                {order.orderItems?.slice(0, 3).map((item, i) => (
                  <div key={item.id || i} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-brand-subtle flex-shrink-0 overflow-hidden">
                      <img
                        src={item.product?.imageUrl || "/placeholder.png"}
                        alt={item.product?.name || "Product"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {item.product?.name || "Produk"}
                      </p>
                      <p className="text-xs text-text-muted">
                        {item.quantity}x @ Rp{item.price?.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                ))}
                {order.orderItems?.length > 3 && (
                  <p className="text-xs text-text-muted">
                    +{order.orderItems.length - 3} item lainnya
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                <p className="text-sm font-bold text-text-primary">
                  Total Rp{order.totalPrice?.toLocaleString("id-ID")}
                </p>
                {order.status === "PENDING" && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleCancel(order.id);
                    }}
                    disabled={cancellingId === order.id}
                    className="text-xs font-bold text-danger hover:text-danger/80 transition-colors disabled:opacity-50"
                  >
                    {cancellingId === order.id ? "Membatalkan..." : "Batalkan"}
                  </button>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderHistoryPage;
