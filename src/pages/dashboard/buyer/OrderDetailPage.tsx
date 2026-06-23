import React from "react";
import { useState } from "react";
import { useParams } from "react-router";
import AlertModal from "../../../shared/components/ui/AlertModal";
import Button from "../../../shared/components/ui/Button";
import ErrorState from "../../../shared/components/ui/ErrorState";
import ReviewModal from "../../../features/review/components/ReviewModal";
import { useOrderDetail } from "../../../features/order/hooks/useOrderDetail";
import { useCancelOrder, useBuyerConfirmOrder } from "../../../features/order/hooks/useOrders";
import { useCreateProductReview } from "../../../features/review/hooks/useReviews";
import { STATUS_COLOR, STATUS_LABEL, SHIPPING_LABEL } from "../../../shared/constants/order";
import Spinner from "../../../shared/components/ui/Spinner";

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: raw, isLoading, error } = useOrderDetail(orderId!);
  const order = (raw as any)?.order ?? raw;
  const cancelMutation = useCancelOrder();
  const confirmMutation = useBuyerConfirmOrder();
  const reviewMutation = useCreateProductReview();
  const [cancelling, setCancelling] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [modal, setModal] = useState<string | null>(null);
  const [reviewModal, setReviewModal] = useState<any>(null);

  const handleCancel = async () => {
    setModal(null);
    setCancelling(true);
    try {
      await cancelMutation.mutateAsync(orderId!);
    } catch { /* handled */ }
    setCancelling(false);
  };

  const handleConfirm = async () => {
    setModal(null);
    setConfirming(true);
    try {
      await confirmMutation.mutateAsync({ orderId: orderId!, storeId: order.storeId });
    } catch { /* handled */ }
    setConfirming(false);
  };

  const handleOpenReview = (item: any) => {
    setReviewModal(item);
  };

  const handleSubmitReview = async (productId: string, rating: number, comment: string) => {
    await reviewMutation.mutateAsync({
      productId,
      orderId: orderId!,
      rating,
      comment,
    } as any);
    setReviewModal(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex items-center justify-center py-20">
        <ErrorState message="Gagal memuat detail pesanan." onRetry={() => window.location.reload()} />
      </div>
    );
  }

  const subtotal = order.subtotal ?? 0;
  const shippingFee = order.shippingFee ?? 0;
  const discountValue = order.discountValue ?? 0;
  const taxFee = order.taxFee ?? 0;
  const totalPrice = order.totalPrice ?? 0;

  return (
    <>
      <div className="max-w-[720px] mx-auto w-full space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-text-primary">Detail Pesanan</h1>
          <span className={`text-xs font-bold ${STATUS_COLOR[order.status] || "text-text-secondary"}`}>
            {STATUS_LABEL[order.status] || order.status}
          </span>
        </div>

        {order.store && (
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-deep/10 flex items-center justify-center text-brand-deep font-bold text-sm">
                {order.store.storeName?.charAt(0) || "S"}
              </div>
              <p className="text-sm font-semibold text-text-primary">{order.store.storeName}</p>
            </div>
          </div>
        )}

        <div className="card">
          <h2 className="text-sm font-bold text-text-primary mb-3">Pesanan #{order.id?.slice(0, 8)}</h2>
          <p className="text-xs text-text-muted mb-4">
            {new Date(order.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          <div className="space-y-3">
            {order.orderItems?.map((item: any, i: number) => (
              <div key={item.id || i} className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-brand-subtle flex-shrink-0 overflow-hidden">
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
                  <p className="text-xs text-text-muted">{item.quantity}x @ Rp{item.price?.toLocaleString("id-ID")}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-text-primary">
                    Rp{(item.price * item.quantity)?.toLocaleString("id-ID")}
                  </p>
                  {order.status === "DELIVERED" && (
                    <button
                      onClick={() => handleOpenReview(item)}
                      className="text-xs text-brand-deep font-semibold mt-1 hover:underline"
                    >
                      Beri Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {order.addressSnapshot && (
          <div className="card">
            <h2 className="text-sm font-bold text-text-primary mb-2">Alamat Pengiriman</h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              {order.addressLabel && (
                <span className="font-semibold text-text-primary">{order.addressLabel}</span>
              )}
              {order.addressLabel && <br />}
              {order.addressSnapshot}
            </p>
          </div>
        )}

        {order.storeAddress && (
          <div className="card">
            <h2 className="text-sm font-bold text-text-primary mb-2">Alamat Toko</h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              {order.storeAddress}
            </p>
          </div>
        )}

        <div className="card">
          <h2 className="text-sm font-bold text-text-primary mb-3">Rincian Pembayaran</h2>

          {order.shippingMethod && (
            <div className="flex justify-between text-sm mb-2">
              <span className="text-text-secondary">Metode Pengiriman</span>
              <span className="font-medium text-text-primary">{SHIPPING_LABEL[order.shippingMethod] || order.shippingMethod}</span>
            </div>
          )}

          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Subtotal</span>
              <span className="font-medium text-text-primary">Rp{subtotal.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Ongkos Kirim</span>
              <span className="font-medium text-text-primary">
                {shippingFee > 0 ? `Rp${shippingFee.toLocaleString("id-ID")}` : "Gratis"}
              </span>
            </div>
            {discountValue > 0 && (
              <div className="flex justify-between text-success">
                <span>Diskon</span>
                <span className="font-medium">-Rp{discountValue.toLocaleString("id-ID")}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-text-secondary">Pajak</span>
              <span className="font-medium text-text-primary">Rp{taxFee.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="font-bold text-text-primary">Total</span>
              <span className="font-bold text-brand-deep text-lg">
                Rp{Math.max(0, totalPrice).toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        {order.statusLogs && order.statusLogs.length > 0 && (
          <div className="card">
            <h2 className="text-sm font-bold text-text-primary mb-3">Riwayat Status</h2>
            <div className="space-y-2">
              {[...order.statusLogs].reverse().map((log: any) => (
                <div key={log.id} className="flex items-center gap-2.5 text-sm">
                  <span className={`w-2 h-2 rounded-full ${STATUS_COLOR[log.status] || "bg-text-muted"}`} />
                  <span className="font-medium text-text-primary">{STATUS_LABEL[log.status] || log.status}</span>
                  <span className="text-text-muted ml-auto">
                    {new Date(log.changedAt).toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card">
          <div className="flex items-center gap-3">
            {order.status === "PENDING" && (
              <Button
                onClick={() => setModal("cancel")}
                variant="primary"
                loading={cancelling}
              >
                {cancelling ? "Membatalkan..." : "Batalkan"}
              </Button>
            )}
            {order.status !== "PENDING" && (
              <span className="text-sm !py-2 !px-6 font-bold opacity-40 cursor-not-allowed border-[3px] border-brand-deep bg-bg-tertiary text-text-muted inline-flex items-center">
                Batalkan
              </span>
            )}
            {order.status === "ON_DELIVERY" && (
              <Button
                onClick={() => setModal("confirm")}
                variant="primary"
                loading={confirming}
              >
                {confirming ? "Mengonfirmasi..." : "Konfirmasi"}
              </Button>
            )}
            {order.status !== "ON_DELIVERY" && (
              <span className="text-sm !py-2 !px-6 font-bold opacity-40 cursor-not-allowed border-[3px] border-brand-deep bg-bg-tertiary text-text-muted inline-flex items-center">
                Konfirmasi
              </span>
            )}
          </div>
        </div>
      </div>

      <AlertModal
        isOpen={!!modal}
        onClose={() => setModal(null)}
        icon={modal === "cancel" ? "⚠️" : "✅"}
        title={modal === "cancel" ? "Batalkan Pesanan" : "Konfirmasi Penerimaan"}
        message={
          modal === "cancel"
            ? "Apakah Anda yakin ingin membatalkan pesanan ini? Pesanan yang dibatalkan tidak dapat dikembalikan."
            : "Apakah Anda yakin ingin mengonfirmasi bahwa pesanan ini sudah diterima?"
        }
        actionLabel={modal === "cancel" ? "Ya, Batalkan" : "Ya, Konfirmasi"}
        onAction={modal === "cancel" ? handleCancel : handleConfirm}
      />

      {reviewModal && (
        <ReviewModal
          order={{
            id: orderId!,
            product: reviewModal.product,
            productId: reviewModal.productId,
            alreadyReviewed: order.reviews?.some(
              (r: any) => r.productId === (reviewModal.product?.id || reviewModal.productId)
            ),
          }}
          onClose={() => setReviewModal(null)}
          onSubmit={handleSubmitReview}
          isPending={reviewMutation.isPending}
          error={reviewMutation.isError ? reviewMutation.error : null}
          multiProduct={false}
        />
      )}
    </>
  );
};

export default OrderDetailPage;
