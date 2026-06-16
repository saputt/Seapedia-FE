import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../../shared/components/layout/Navbar";
import Footer from "../../../shared/components/layout/Footer";
import { getOrderById } from "../../../features/order/api/order.api";

const STATUS_LABEL = {
  PENDING: "Menunggu Konfirmasi",
  READY_FOR_DELIVERY: "Siap Dikirim",
  ON_DELIVERY: "Dalam Pengiriman",
  DELIVERED: "Selesai",
  CANCELLED: "Dibatalkan",
};

const STATUS_STYLE = {
  PENDING: "text-yellow-600 bg-yellow-50",
  READY_FOR_DELIVERY: "text-blue-600 bg-blue-50",
  ON_DELIVERY: "text-purple-600 bg-purple-50",
  DELIVERED: "text-green-600 bg-green-50",
  CANCELLED: "text-red-600 bg-red-50",
};

const SHIPPING_LABEL = {
  REGULAR: "Reguler (3-5 hari)",
  INSTANT: "Instant (1-2 hari)",
  NEXT_DAY: "Next Day (Besok)",
};

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrderById(orderId)
      .then(setOrder)
      .catch((err) => setError(err?.message || "Gagal memuat detail pesanan."))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
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

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-bg-primary">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="card text-center max-w-md">
            <p className="text-danger font-semibold mb-4">{error}</p>
            <button
              onClick={() => navigate("/dashboard/buyer/orders")}
              className="btn-primary text-sm !py-2 !px-6"
            >
              Kembali
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar variant="checkout" />

      <main className="flex-1 max-w-[720px] mx-auto w-full px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-text-primary">Detail Pesanan</h1>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              STATUS_STYLE[order.status] || "text-gray-600 bg-gray-50"
            }`}
          >
            {STATUS_LABEL[order.status] || order.status}
          </span>
        </div>

        {/* Store */}
        <div className="card">
          <p className="text-sm font-semibold text-text-primary">
            {order.store?.name || "Toko"}
          </p>
        </div>

        {/* Items */}
        <div className="card">
          <h2 className="text-sm font-bold text-text-primary mb-3">
            Produk ({order.orderItems?.length || 0})
          </h2>
          <div className="space-y-3">
            {order.orderItems?.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-14 h-14 bg-bg-tertiary rounded flex items-center justify-center overflow-hidden shrink-0">
                  {item.product?.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-text-muted">Img</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {item.product?.name}
                  </p>
                  <p className="text-xs text-text-secondary">
                    Rp{item.price?.toLocaleString("id-ID")} x {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-text-primary shrink-0">
                  Rp{(item.price * item.quantity).toLocaleString("id-ID")}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Address */}
        <div className="card">
          <h2 className="text-sm font-bold text-text-primary mb-2">
            Alamat Pengiriman
          </h2>
          <p className="text-sm font-semibold text-text-primary">
            {order.address?.label}
          </p>
          <p className="text-xs text-text-secondary mt-0.5">
            {order.address?.completeAddress}
          </p>
        </div>

        {/* Shipping */}
        <div className="card">
          <h2 className="text-sm font-bold text-text-primary mb-2">
            Metode Pengiriman
          </h2>
          <p className="text-sm text-text-primary">
            {SHIPPING_LABEL[order.shippingMethod] || order.shippingMethod}
          </p>
        </div>

        {/* Price Summary */}
        <div className="card">
          <h2 className="text-sm font-bold text-text-primary mb-3">
            Ringkasan Pembayaran
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Subtotal</span>
              <span className="font-medium">
                Rp{order.subtotal?.toLocaleString("id-ID")}
              </span>
            </div>
            {order.discountValue > 0 && (
              <div className="flex justify-between text-success">
                <span>Diskon</span>
                <span className="font-medium">
                  -Rp{order.discountValue?.toLocaleString("id-ID")}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-text-secondary">Ongkos Kirim</span>
              <span className="font-medium">
                Rp{order.shippingFee?.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Pajak (12%)</span>
              <span className="font-medium">
                Rp{order.taxFee?.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="border-t-[2px] border-bg-tertiary pt-2 flex justify-between text-base font-bold">
              <span>Total</span>
              <span className="text-brand-deep">
                Rp{order.totalPrice?.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        {/* Order Date */}
        <p className="text-xs text-text-muted text-center">
          Dibuat pada{" "}
          {new Date(order.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        {/* Back */}
        <button
          onClick={() => navigate("/dashboard/buyer/orders")}
          className="btn-ghost w-full text-sm !py-2"
        >
          Kembali ke Pesanan
        </button>
      </main>

      <Footer />
    </div>
  );
};

export default OrderDetailPage;
