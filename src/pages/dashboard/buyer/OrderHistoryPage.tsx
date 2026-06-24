import React from "react";
import { useState } from "react";
import { Link } from "react-router";
import AlertModal from "../../../shared/components/ui/AlertModal";
import Button from "../../../shared/components/ui/Button";
import ErrorState from "../../../shared/components/ui/ErrorState";
import ReviewModal from "../../../features/review/components/ReviewModal";
import { useBuyerOrders, useCancelOrder, useBuyerConfirmOrder } from "../../../features/order/hooks/useOrders";
import { useCreateProductReview } from "../../../features/review/hooks/useReviews";
import { STATUS_COLOR, STATUS_LABEL } from "../../../shared/constants/order";
import Spinner from "../../../shared/components/ui/Spinner";

interface ModalState {
  type: "cancel" | "confirm";
  orderId: string;
  storeId?: string;
}

const OrderHistoryPage: React.FC = () => {
  const { data: orders = [], isLoading, error } = useBuyerOrders();
  const cancelMutation = useCancelOrder();
  const confirmMutation = useBuyerConfirmOrder();
  const reviewMutation = useCreateProductReview();
  const [filter, setFilter] = useState("ALL");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [reviewOrder, setReviewOrder] = useState<any>(null);

  const statuses = ["ALL", "PENDING", "READY_FOR_DELIVERY", "ON_DELIVERY", "DELIVERED", "CANCELLED"];

  const filtered =
    filter === "ALL"
      ? orders
      : orders.filter((o: any) => o.status === filter);

  const handleCancel = async (orderId: string) => {
    setModal(null);
    setCancellingId(orderId);
    try {
      await cancelMutation.mutateAsync(orderId);
    } catch { /* handled */ }
    setCancellingId(null);
  };

  const handleConfirm = async (orderId: string, storeId: string) => {
    setModal(null);
    setConfirmingId(orderId);
    try {
      await confirmMutation.mutateAsync({ orderId, storeId });
    } catch { /* handled */ }
    setConfirmingId(null);
  };

  const handleOpenReview = (order: any) => {
    setReviewOrder(order);
  };

  const handleSubmitReview = async (productId: string, rating: number, comment: string) => {
    await reviewMutation.mutateAsync({
      productId,
      orderId: reviewOrder.id,
      rating,
      comment,
    } as any);
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
        <ErrorState message="Gagal memuat pesanan." onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <>
    <div className="max-w-[720px] mx-auto w-full space-y-6">
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
          {filtered.map((order: any) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
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
                {order.orderItems?.slice(0, 3).map((item: any, i: number) => (
                  <div key={item.id || i} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-brand-subtle flex-shrink-0 overflow-hidden">
                      <img
                        src={item.product?.imageUrl || "/placeholder.png"}
                        alt={item.product?.name || "Product"}
                        loading="lazy"
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
                  {order.status === "ON_DELIVERY" && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        setModal({ type: "confirm", orderId: order.id, storeId: order.storeId });
                      }}
                      loading={confirmingId === order.id}
                    >
                      {confirmingId === order.id ? "Mengonfirmasi..." : "Konfirmasi"}
                    </Button>
                  )}
                  {order.status === "PENDING" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        setModal({ type: "cancel", orderId: order.id });
                      }}
                      loading={cancellingId === order.id}
                    >
                      {cancellingId === order.id ? "Membatalkan..." : "Batalkan"}
                    </Button>
                  )}
                  {order.status === "DELIVERED" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={order.reviews?.length >= order.orderItems?.length}
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        if (!(order.reviews?.length >= order.orderItems?.length)) {
                          handleOpenReview(order);
                        }
                      }}
                    >
                      {order.reviews?.length >= order.orderItems?.length ? "Sudah Direview" : "Beri Rating"}
                    </Button>
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
        onAction={() => {
          if (!modal) return;
          modal.type === "cancel"
            ? handleCancel(modal.orderId)
            : handleConfirm(modal.orderId, modal.storeId!);
        }}
      />

      {reviewOrder && (
        <ReviewModal
          order={reviewOrder}
          onClose={() => setReviewOrder(null)}
          onSubmit={handleSubmitReview}
          isPending={reviewMutation.isPending}
          error={reviewMutation.isError ? reviewMutation.error : null}
          multiProduct
        />
      )}
    </>
  );
};

export default OrderHistoryPage;
