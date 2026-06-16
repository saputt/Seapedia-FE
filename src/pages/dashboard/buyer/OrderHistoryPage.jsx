import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../shared/components/layout/Navbar";
import Footer from "../../../shared/components/layout/Footer";
import { getBuyerOrders } from "../../../features/order/api/order.api";

const STATUS_TABS = [
  { key: "ALL", label: "Semua" },
  { key: "PENDING", label: "Menunggu" },
  { key: "READY_FOR_DELIVERY", label: "Siap Dikirim" },
  { key: "ON_DELIVERY", label: "Dikirim" },
  { key: "DELIVERED", label: "Selesai" },
  { key: "CANCELLED", label: "Dibatalkan" },
];

const STATUS_STYLE = {
  PENDING: "text-yellow-600 bg-yellow-50",
  READY_FOR_DELIVERY: "text-blue-600 bg-blue-50",
  ON_DELIVERY: "text-purple-600 bg-purple-50",
  DELIVERED: "text-green-600 bg-green-50",
  CANCELLED: "text-red-600 bg-red-50",
};

const STATUS_LABEL = {
  PENDING: "Menunggu Konfirmasi",
  READY_FOR_DELIVERY: "Siap Dikirim",
  ON_DELIVERY: "Dalam Pengiriman",
  DELIVERED: "Selesai",
  CANCELLED: "Dibatalkan",
};

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");

  useEffect(() => {
    getBuyerOrders()
      .then(setOrders)
      .catch((err) => setError(err?.message || "Gagal memuat pesanan."))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeTab === "ALL"
      ? orders
      : orders.filter((o) => o.status === activeTab);

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

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />

      <main className="flex-1 max-w-[720px] mx-auto w-full px-6 lg:px-8 py-8 space-y-6">
        <h1 className="text-xl font-bold text-text-primary">Pesanan Saya</h1>

        {error && (
          <div className="card text-center py-10">
            <p className="text-danger font-semibold mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary text-sm !py-2 !px-6"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!error && (
          <>
            {/* Status Tabs */}
            <div className="flex gap-1 overflow-x-auto pb-1">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`whitespace-nowrap text-sm font-medium px-4 py-2 rounded transition-colors ${
                    activeTab === tab.key
                      ? "bg-brand-deep text-white"
                      : "text-text-secondary hover:text-brand-deep hover:bg-brand-subtle"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Order List */}
            {filtered.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-text-secondary">
                  {activeTab === "ALL"
                    ? "Belum ada pesanan."
                    : `Tidak ada pesanan dengan status ini.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => navigate(`/dashboard/buyer/orders/${order.id}`)}
                    className="card cursor-pointer hover:bg-brand-subtle transition-colors"
                  >
                    {/* Store Header */}
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-text-primary">
                        {order.store?.name || "Toko"}
                      </p>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          STATUS_STYLE[order.status] || "text-gray-600 bg-gray-50"
                        }`}
                      >
                        {STATUS_LABEL[order.status] || order.status}
                      </span>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2 mb-3">
                      {order.orderItems?.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-bg-tertiary rounded flex items-center justify-center overflow-hidden shrink-0">
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
                      {order.orderItems?.length > 3 && (
                        <p className="text-xs text-text-muted text-center">
                          ...dan {order.orderItems.length - 3} produk lainnya
                        </p>
                      )}
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between pt-2 border-t-[2px] border-bg-tertiary">
                      <p className="text-xs text-text-muted">
                        {new Date(order.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-sm font-bold text-brand-deep">
                        Rp{order.totalPrice?.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OrderHistoryPage;
