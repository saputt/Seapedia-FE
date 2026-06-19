import { useState } from "react";
import { useSellerOrders, useUpdateOrderStatus } from "../../../features/order/hooks/useOrders";
import { useMyStore } from "../../../features/store/hooks/useMyStore";
import { STATUS_LABEL, STATUS_COLOR, SHIPPING_LABEL } from "../../../shared/constants/order";
import Button from "../../../shared/components/ui/Button";
import Spinner from "../../../shared/components/ui/Spinner";

const statusFilters = ["ALL", "PENDING", "READY_FOR_DELIVERY", "ON_DELIVERY", "DELIVERED", "CANCELLED"];

const OrderManagementPage = () => {
  const [filter, setFilter] = useState("ALL");
  const [expandedId, setExpandedId] = useState(null);

  const { data: store } = useMyStore();
  const { data: orders = [], isLoading, isFetching, error } = useSellerOrders(
    filter === "ALL" ? { orderBy: "desc" } : { status: filter, orderBy: "asc" }
  );
  const progressMutation = useUpdateOrderStatus();

  const handleProgress = (orderId) => {
    if (!store?.id) return;
    progressMutation.mutate({ orderId, storeId: store.id });
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-text-primary mb-1">Pesanan</h1>
        <p className="text-sm text-text-muted mb-6">Kelola pesanan masuk toko Anda</p>
        <div className="card text-center py-10">
          <p className="text-danger font-semibold mb-4">Gagal memuat pesanan.</p>
          <Button onClick={() => window.location.reload()} variant="primary" size="sm">
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-text-primary mb-1">Pesanan</h1>
      <p className="text-sm text-text-muted mb-6">Kelola pesanan masuk toko Anda</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {statusFilters.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
              filter === s
                ? "bg-brand-deep text-white border-brand-deep"
                : "border-border bg-white text-text-secondary hover:bg-brand-subtle"
            }`}
          >
            {s === "ALL" ? "Semua" : STATUS_LABEL[s] || s}
          </button>
        ))}
      </div>

      <div className="relative min-h-[200px]">
        {(isLoading || isFetching) && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
            <Spinner size="lg" />
          </div>
        )}

        {!isLoading && orders.length === 0 && (
          <div className="card text-center py-10">
            <p className="text-sm text-text-secondary">
              {filter === "ALL" ? "Belum ada pesanan." : `Tidak ada pesanan dengan status "${STATUS_LABEL[filter] || filter}".`}
            </p>
          </div>
        )}

        {orders.length > 0 && (
        <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="card overflow-hidden">
            <div
              className="p-5 cursor-pointer hover:bg-brand-subtle/30 transition-colors"
              onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-xs text-text-muted">
                      {new Date(order.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      #{order.id.slice(0, 8)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${STATUS_COLOR[order.status] || "text-text-secondary"}`}>
                    {STATUS_LABEL[order.status] || order.status}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`text-text-muted transition-transform ${expandedId === order.id ? "rotate-180" : ""}`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                {order.buyer && (
                  <span className="text-sm text-text-secondary">
                    {order.buyer.username}
                  </span>
                )}
                {order.shippingMethod && (
                  <span className="text-xs bg-brand-subtle text-text-secondary px-2 py-0.5 rounded">
                    {SHIPPING_LABEL[order.shippingMethod] || order.shippingMethod}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {order.orderItems?.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
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
                    <p className="text-sm font-semibold text-text-primary">
                      Rp{(item.price * item.quantity)?.toLocaleString("id-ID")}
                    </p>
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
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProgress(order.id);
                    }}
                    variant="primary"
                    size="sm"
                    loading={progressMutation.isPending}
                  >
                    {progressMutation.isPending ? "Memproses..." : "Konfirmasi"}
                  </Button>
                )}
              </div>
            </div>

            {expandedId === order.id && (
              <div className="border-t border-border px-5 py-4 space-y-4 bg-brand-subtle/20">
                {order.address && (
                  <div>
                    <p className="text-xs font-semibold text-text-muted mb-1">Alamat Pengiriman</p>
                    <p className="text-sm text-text-secondary">
                      {order.address.label && <span className="font-medium text-text-primary">{order.address.label}</span>}
                      {order.address.label && <br />}
                      {order.address.completeAddress}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-text-muted mb-1">Subtotal</p>
                    <p className="text-text-primary">Rp{order.subtotal?.toLocaleString("id-ID")}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-muted mb-1">Ongkos Kirim</p>
                    <p className="text-text-primary">
                      {order.shippingFee > 0 ? `Rp${order.shippingFee?.toLocaleString("id-ID")}` : "Gratis"}
                    </p>
                  </div>
                  {order.discountValue > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-text-muted mb-1">Diskon</p>
                      <p className="text-success">-Rp{order.discountValue?.toLocaleString("id-ID")}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-text-muted mb-1">Pajak</p>
                    <p className="text-text-primary">Rp{order.taxFee?.toLocaleString("id-ID")}</p>
                  </div>
                </div>

                {order.statusLogs && order.statusLogs.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-text-muted mb-2">Riwayat Status</p>
                    <div className="space-y-1.5">
                      {order.statusLogs.map((log) => (
                        <div key={log.id} className="flex items-center gap-2 text-xs">
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_COLOR[log.status] || "bg-text-muted"}`} />
                          <span className="font-medium">{STATUS_LABEL[log.status] || log.status}</span>
                          <span className="text-text-muted">
                            {new Date(log.changedAt).toLocaleString("id-ID")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagementPage;
