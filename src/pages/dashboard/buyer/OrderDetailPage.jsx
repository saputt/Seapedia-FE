import { useParams } from "react-router";
import Navbar from "../../../shared/components/layout/Navbar";
import Footer from "../../../shared/components/layout/Footer";
import { useOrderDetail } from "../../../features/order/hooks/useOrderDetail";
import { useCancelOrder } from "../../../features/order/hooks/useOrders";
import { useState } from "react";

const STATUS_LABEL = {
  PENDING: "Menunggu Konfirmasi",
  READY_FOR_DELIVERY: "Siap Dikirim",
  ON_DELIVERY: "Dalam Pengiriman",
  DELIVERED: "Diterima",
  CANCELLED: "Dibatalkan",
};

const STATUS_COLOR = {
  PENDING: "text-warning",
  READY_FOR_DELIVERY: "text-info",
  ON_DELIVERY: "text-info",
  DELIVERED: "text-success",
  CANCELLED: "text-danger",
};

const SHIPPING_LABEL = {
  REGULAR: "Reguler",
  INSTANT: "Instan",
  NEXT_DAY: "Besok",
};

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const { data: raw, isLoading, error } = useOrderDetail(orderId);
  const order = raw?.order ?? raw;
  const cancelMutation = useCancelOrder();
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await cancelMutation.mutateAsync(orderId);
    } catch (e) { /* handled */ }
    setCancelling(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-bg-primary">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <span className="w-8 h-8 border-[3px] border-brand-deep border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col bg-bg-primary">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="card text-center py-10">
            <p className="text-danger font-semibold mb-4">Gagal memuat detail pesanan.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary text-sm !py-2 !px-6"
            >
              Coba Lagi
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = order.subtotal ?? 0;
  const shippingFee = order.shippingFee ?? 0;
  const discountValue = order.discountValue ?? 0;
  const taxFee = order.taxFee ?? 0;
  const totalPrice = order.totalPrice ?? 0;

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />
      <main className="flex-1 max-w-[720px] mx-auto w-full px-6 lg:px-8 py-8 space-y-6">
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
            {order.orderItems?.map((item, i) => (
              <div key={item.id || i} className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-brand-subtle flex-shrink-0 overflow-hidden">
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
                  <p className="text-xs text-text-muted">{item.quantity}x @ Rp{item.price?.toLocaleString("id-ID")}</p>
                </div>
                <p className="text-sm font-semibold text-text-primary">
                  Rp{(item.price * item.quantity)?.toLocaleString("id-ID")}
                </p>
              </div>
            ))}
          </div>
        </div>

        {order.address && (
          <div className="card">
            <h2 className="text-sm font-bold text-text-primary mb-2">Alamat Pengiriman</h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              {order.address.label && (
                <span className="font-semibold text-text-primary">{order.address.label}</span>
              )}
              {order.address.label && <br />}
              {order.address.completeAddress}
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

        {order.status === "PENDING" && (
          <div className="card">
            <p className="text-sm text-text-secondary mb-3">
              Apakah Anda yakin ingin membatalkan pesanan ini?
            </p>
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="btn-primary bg-danger hover:bg-danger/90 text-sm !py-2 !px-6"
            >
              {cancelling ? "Membatalkan..." : "Batalkan Pesanan"}
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetailPage;
