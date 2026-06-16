import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../shared/components/layout/Navbar";
import Footer from "../../shared/components/layout/Footer";
import AlertModal from "../../shared/components/ui/AlertModal";
import AddressSelector from "../../features/order/components/AddressSelector";
import {
  getOrderSummary,
  checkoutOrder,
} from "../../features/order/api/order.api";

const SHIPPING_LIST = [
  { id: "REGULAR", name: "Regular", price: 10000, desc: "Estimasi 3–5 hari" },
  { id: "INSTANT", name: "Instant", price: 15000, desc: "Estimasi 1–2 hari" },
  { id: "NEXT_DAY", name: "Next Day", price: 20000, desc: "Besok sampai" },
];

const CheckoutPage = () => {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [orderToken, setOrderToken] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [initialError, setInitialError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const [shippingMethod, setShippingMethod] = useState("REGULAR");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [discountSuccess, setDiscountSuccess] = useState("");

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressSelector, setShowAddressSelector] = useState(false);

  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const checkoutUrlRef = useRef(window.location.href);

  useEffect(() => {
    if (checkoutSuccess) return;

    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [checkoutSuccess]);

  useEffect(() => {
    if (checkoutSuccess) return;

    const handlePopState = () => {
      const stay = window.confirm("Yakin ingin keluar? Pesanan Anda akan hilang.");
      if (!stay) {
        window.history.pushState(null, "", checkoutUrlRef.current);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [checkoutSuccess]);

  const fetchSummary = useCallback(async (discount, shipping, isInitial = false) => {
    if (isInitial) {
      setInitialLoading(true);
      setInitialError("");
    } else {
      setRefreshing(true);
    }
    try {
      const body = {};
      if (discount) body.discountCode = discount;
      if (shipping) body.shippingMethod = shipping;
      const result = await getOrderSummary(body);
      setSummary(result.order);
      setOrderToken(result.orderToken);
      if (discount) {
        setDiscountSuccess(`Diskon ${discount} berhasil diterapkan!`);
        setDiscountError("");
      }
    } catch (err) {
      const msg = err?.message || "";
      if (discount && msg.toLowerCase().includes("not found")) {
        setAppliedCode("");
        setDiscountCode("");
        setDiscountError("Kode diskon tidak ditemukan.");
        setDiscountSuccess("");
      } else if (discount && (msg.toLowerCase().includes("expired") || msg.toLowerCase().includes("not available"))) {
        setAppliedCode("");
        setDiscountCode("");
        setDiscountError("Kode diskon sudah tidak berlaku.");
        setDiscountSuccess("");
      } else if (isInitial) {
        setInitialError(msg || "Gagal memuat ringkasan pesanan.");
      } else {
        setDiscountError(msg || "Gagal menerapkan diskon.");
        setDiscountSuccess("");
      }
    } finally {
      if (isInitial) setInitialLoading(false);
      else setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary(null, null, true);
  }, [fetchSummary]);

  useEffect(() => {
    if (!initialLoading && !initialError) {
      fetchSummary(appliedCode, shippingMethod, false);
    }
  }, [appliedCode, shippingMethod]);

  const handleApplyDiscount = () => {
    const trimmed = discountCode.trim().toUpperCase();
    if (!trimmed) return;
    setAppliedCode(trimmed);
    setDiscountError("");
    setDiscountSuccess("");
  };

  const handleRemoveDiscount = () => {
    setDiscountCode("");
    setAppliedCode("");
    setDiscountError("");
    setDiscountSuccess("");
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      setCheckoutError("Silakan pilih alamat pengiriman terlebih dahulu.");
      return;
    }
    if (!orderToken) {
      setCheckoutError("Ringkasan pesanan tidak valid. Silakan refresh.");
      return;
    }

    setCheckingOut(true);
    setCheckoutError("");
    try {
      await checkoutOrder({
        orderToken,
        addressId: selectedAddress.id,
      });
      setCheckoutSuccess(true);
    } catch (err) {
      setCheckoutError(err?.message || "Checkout gagal. Silakan coba lagi.");
    } finally {
      setCheckingOut(false);
    }
  };

  if (checkoutSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-bg-primary">
        <Navbar variant="checkout" />
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="card text-center max-w-md">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              Pesanan Berhasil!
            </h2>
            <p className="text-text-secondary mb-6">
              Pesanan Anda sedang diproses. Silakan cek status pesanan di halaman pesanan.
            </p>
            <button
              onClick={() => navigate("/dashboard/buyer/orders")}
              className="btn-primary text-sm !py-2 !px-6"
            >
              Lihat Pesanan
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = summary?.subtotal ?? 0;
  const discountValue = summary?.discountValue ?? 0;
  const shippingFee = summary?.shippingFee ?? 0;
  const taxFee = summary?.taxFee ?? 0;
  const totalPrice = summary?.totalPrice ?? 0;

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar variant="checkout" />

      <main className="flex-1 max-w-[960px] mx-auto w-full px-6 lg:px-8 py-8">
        {initialLoading && (
          <div className="space-y-6 animate-pulse">
            <div className="card h-24 bg-bg-tertiary" />
            <div className="card h-48 bg-bg-tertiary" />
            <div className="card h-32 bg-bg-tertiary" />
          </div>
        )}

        {initialError && !initialLoading && (
          <div className="text-center py-20">
            <p className="text-danger font-semibold text-lg mb-4">
              {initialError}
            </p>
            <button
              onClick={() => fetchSummary(null, null, true)}
              className="btn-primary text-sm !py-2 !px-6"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!initialLoading && !initialError && summary && (
          <div className="space-y-6">
            {/* Address */}
            <div className="card">
              <h2 className="text-sm font-bold text-text-primary mb-3">
                Alamat Pengiriman
              </h2>
              {selectedAddress ? (
                <div
                  onClick={() => setShowAddressSelector(true)}
                  className="cursor-pointer hover:bg-brand-subtle -mx-3 -my-2 px-3 py-2 rounded transition-colors"
                >
                  <p className="text-sm font-semibold text-text-primary">
                    {selectedAddress.label}
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {selectedAddress.completeAddress}
                  </p>
                  <p className="text-xs text-brand-deep mt-1 font-medium">
                    Ketuk untuk mengganti
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-text-secondary mb-3">
                    Belum ada alamat pengiriman dipilih.
                  </p>
                  <button
                    onClick={() => setShowAddressSelector(true)}
                    className="btn-primary text-sm !py-1 !px-4"
                  >
                    Pilih Alamat
                  </button>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="card">
              <h2 className="text-sm font-bold text-text-primary mb-3">
                Produk ({summary.products?.length || 0})
              </h2>
              <div className="space-y-3">
                {summary.products?.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-3"
                  >
                    <div className="w-14 h-14 bg-bg-tertiary rounded flex items-center justify-center overflow-hidden shrink-0">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-text-muted">Img</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-text-secondary">
                        Rp{item.price?.toLocaleString("id-ID")} x {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-text-primary shrink-0">
                      Rp{item.totalItemPrice?.toLocaleString("id-ID")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Discount */}
            <div className="card">
              <h2 className="text-sm font-bold text-text-primary mb-3">
                Kode Diskon
              </h2>
              {appliedCode ? (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-success">{appliedCode}</p>
                    {discountValue > 0 && (
                      <p className="text-xs text-text-secondary">
                        Diskon: Rp{discountValue.toLocaleString("id-ID")}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleRemoveDiscount}
                    className="text-sm text-danger hover:underline self-start sm:self-auto"
                  >
                    Hapus
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyDiscount()}
                    className="input-neo w-full !py-2 !text-sm"
                    placeholder="Masukkan kode diskon"
                  />
                  <button
                    onClick={handleApplyDiscount}
                    disabled={!discountCode.trim()}
                    className="btn-primary text-sm !py-2 !px-5 w-full sm:w-auto whitespace-nowrap"
                  >
                    Pakai
                  </button>
                </div>
              )}
              {discountError && (
                <p className="text-danger text-xs mt-1">{discountError}</p>
              )}
              {discountSuccess && (
                <p className="text-success text-xs mt-1">{discountSuccess}</p>
              )}
            </div>

            {/* Shipping */}
            <div className="card relative">
              <h2 className="text-sm font-bold text-text-primary mb-3">
                Metode Pengiriman
              </h2>
              <div className="space-y-2">
                {SHIPPING_LIST.map((s) => (
                  <label
                    key={s.id}
                    className={`flex items-center gap-3 px-3 py-2 rounded border-[2px] cursor-pointer transition-colors ${
                      shippingMethod === s.id
                        ? "border-brand-deep bg-brand-subtle"
                        : "border-bg-tertiary hover:border-brand-light"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value={s.id}
                      checked={shippingMethod === s.id}
                      onChange={() => setShippingMethod(s.id)}
                      className="accent-brand-deep shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary">
                        {s.name}
                      </p>
                      <p className="text-xs text-text-secondary">{s.desc}</p>
                    </div>
                    <p className="text-sm font-semibold text-text-primary shrink-0">
                      Rp{s.price.toLocaleString("id-ID")}
                    </p>
                  </label>
                ))}
              </div>

              {refreshing && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded">
                  <span className="w-6 h-6 border-[3px] border-brand-deep border-t-transparent rounded-full animate-spin" />
                </div>
              )}
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
                    Rp{subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
                {discountValue > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Diskon</span>
                    <span className="font-medium">
                      -Rp{discountValue.toLocaleString("id-ID")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-text-secondary">Ongkos Kirim</span>
                  <span className="font-medium">
                    Rp{shippingFee.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Pajak (12%)</span>
                  <span className="font-medium">
                    Rp{taxFee.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="border-t-[2px] border-bg-tertiary pt-2 flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="text-brand-deep">
                    Rp{totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            {checkoutError && (
              <p className="text-danger text-sm text-center">{checkoutError}</p>
            )}
            <button
              onClick={handleCheckout}
              disabled={checkingOut || !selectedAddress}
              className="btn-primary w-full !py-3 text-base"
            >
              {checkingOut ? "Memproses..." : "Buat Pesanan"}
            </button>
          </div>
        )}
      </main>

      <AddressSelector
        isOpen={showAddressSelector}
        onClose={() => setShowAddressSelector(false)}
        onSelect={(addr) => {
          setSelectedAddress(addr);
          setShowAddressSelector(false);
        }}
        selectedId={selectedAddress?.id}
      />

      <Footer />
    </div>
  );
};

export default CheckoutPage;
