import { useState } from "react";
import { Link } from "react-router";
import AlertModal from "../../../shared/components/ui/AlertModal";
import Button from "../../../shared/components/ui/Button";
import { useBuyerOrders, useCancelOrder, useBuyerConfirmOrder } from "../../../features/order/hooks/useOrders";
import { STATUS_COLOR, STATUS_LABEL } from "../../../shared/constants/order";
import Spinner from "../../../shared/components/ui/Spinner";

const OrderHistoryPage = () => {
  const { data: orders = [], isLoading, error } = useBuyerOrders();
  const cancelMutation = useCancelOrder();
  const confirmMutation = useBuyerConfirmOrder();
  const [filter, setFilter] = useState("ALL");
  const [cancellingId, setCancellingId] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [modal, setModal] = useState(null);

  const statuses = ["ALL", ...new Set(orders.map((o) => o.status))];

  const filtered =
    filter === "ALL"
      ? orders
      : orders.filter((o) => o.status === filter);

  const handleCancel = async (orderId) => {
    setModal(null);
    setCancellingId(orderId);
    try {
      await cancelMutation.mutateAsync(orderId);
    } catch { /* handled */ }
    setCancellingId(null);
  };

  const handleConfirm = async (orderId, storeId) => {
    setModal(null);
    setConfirmingId(orderId);
    try {
      await confirmMutation.mutateAsync({ orderId, storeId });
    } catch { /* handled */ }
    setConfirmingId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
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
    <>
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (order.status === "PENDING") {
                        setModal({ type: "cancel", orderId: order.id });
                      }
                    }}
                    disabled={order.status !== "PENDING" || cancellingId === order.id}
                    className={`text-xs font-bold transition-colors disabled:opacity-40 ${
                      order.status === "PENDING"
                        ? "text-danger hover:text-danger/80"
                        : "text-text-muted cursor-not-allowed"
                    }`}
                  >
                    {cancellingId === order.id ? "Membatalkan..." : "Batalkan"}
                  </button>
                  {order.status === "ON_DELIVERY" && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setModal({ type: "confirm", orderId: order.id, storeId: order.storeId });
                      }}
                      disabled={confirmingId === order.id}
                      className="text-xs font-bold text-success hover:text-success/80 transition-colors disabled:opacity-50"
                    >
                      {confirmingId === order.id ? "Mengonfirmasi..." : "Konfirmasi"}
                    </button>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <AlertModal
        isOpen={!!modal}
        onClose={() => setModal(null)}
        icon={modal?.type === "cancel" ? "⚠️" : "✅"}
        title={modal?.type === "cancel" ? "Batalkan Pesanan" : "Konfirmasi Penerimaan"}
        message={
          modal?.type === "cancel"
            ? "Apakah Anda yakin ingin membatalkan pesanan ini? Pesanan yang dibatalkan tidak dapat dikembalikan."
            : "Apakah Anda yakin ingin mengonfirmasi bahwa pesanan ini sudah diterima?"
        }
        actionLabel={modal?.type === "cancel" ? "Ya, Batalkan" : "Ya, Konfirmasi"}
        onAction={() =>
          modal?.type === "cancel"
            ? handleCancel(modal.orderId)
            : handleConfirm(modal.orderId, modal.storeId)
        }
      />
    </>
  );
};

export default OrderHistoryPage;
