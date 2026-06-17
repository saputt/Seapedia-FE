import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import Navbar from "../../../shared/components/layout/Navbar";
import Footer from "../../../shared/components/layout/Footer";
import AddressSelector from "../../../features/order/components/AddressSelector";
import { useOrderSummary } from "../../../features/order/hooks/useOrderSummary";
import { checkoutOrder } from "../../../features/order/api/order.api";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedAddressData, setSelectedAddressData] = useState(null);
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [appliedCode, setAppliedCode] = useState(null);
  const [codeInput, setCodeInput] = useState("");
  const [discountErr, setDiscountErr] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const {
    data: summary,
    isLoading: summaryLoading,
    isFetching: summaryUpdating,
    error: summaryError,
  } = useOrderSummary(appliedCode, selectedShipping);

  useEffect(() => {
    if (summary) {
      if (summary.discountError) {
        setDiscountErr(summary.discountError);
        setAppliedCode(null);
        setSuccessMsg(null);
      } else {
        setDiscountErr(null);
        if (appliedCode) setSuccessMsg("Kode berhasil dipakai!");
      }
    }
  }, [summary, appliedCode]);

  useEffect(() => {
    if (summaryError) {
      const errCode = summaryError?.response?.data?.code;
      if (errCode === "DISCOUNT_CODE_NOT_FOUND" || errCode === "DISCOUNT_EXPIRED") {
        setDiscountErr(summaryError.response.data.message || errCode);
        setAppliedCode(null);
        setSuccessMsg(null);
      }
    }
  }, [summaryError]);

  useEffect(() => {
    if (summary?.shippingMethods && selectedShipping === null) {
      const defaultMethod = summary.shippingMethods.find((s) => s.isDefault) || summary.shippingMethods[0];
      if (defaultMethod) setSelectedShipping(defaultMethod.id);
    }
  }, [summary, selectedShipping]);

  const checkoutMutation = useMutation({
    mutationFn: (payload) => checkoutOrder(payload),
    onSuccess: () => navigate("/dashboard/buyer/orders"),
  });

  const handleApplyCode = useCallback(() => {
    const trimmed = codeInput.trim();
    if (!trimmed) return;
    setDiscountErr(null);
    setSuccessMsg(null);
    setAppliedCode(trimmed);
  }, [codeInput]);

  const handleRemoveCode = useCallback(() => {
    setAppliedCode(null);
    setCodeInput("");
    setDiscountErr(null);
    setSuccessMsg(null);
  }, []);

  const handleSelectAddress = useCallback((addr) => {
    setSelectedAddress(addr.id);
    setSelectedAddressData(addr);
    setShowAddressSelector(false);
  }, []);

  const handleCheckout = useCallback(async () => {
    if (!selectedAddress || !selectedShipping) return;
    checkoutMutation.mutate({
      addressId: selectedAddress,
      shippingMethod: selectedShipping,
      discountCode: appliedCode || undefined,
    });
  }, [selectedAddress, selectedShipping, appliedCode, checkoutMutation]);

  const selectedShippingData = summary?.shippingMethods?.find((s) => s.id === selectedShipping);
  const subtotal = summary?.subtotal ?? 0;
  const shippingCost = selectedShippingData?.cost ?? 0;
  const discount = summary?.discount ?? 0;
  const total = subtotal + shippingCost - discount;

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />
      <main className="flex-1 max-w-[720px] mx-auto w-full px-6 lg:px-8 py-8 space-y-6">
        <h1 className="text-xl font-bold text-text-primary">Checkout</h1>

        <div
          className="card cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setShowAddressSelector(true)}
        >
          <h2 className="text-sm font-bold text-text-primary mb-3">Alamat Pengiriman</h2>

          {!selectedAddressData ? (
            <p className="text-sm text-brand-deep font-semibold">+ Pilih Alamat</p>
          ) : (
            <div>
              <p className="text-sm font-semibold text-text-primary">
                {selectedAddressData.label || "Alamat"}
              </p>
              {selectedAddressData.completeAddress && (
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  {selectedAddressData.completeAddress}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-sm font-bold text-text-primary mb-3">Ringkasan Pesanan</h2>

          {summaryLoading && (
            <div className="flex items-center justify-center py-6">
              <span className="w-6 h-6 border-[3px] border-brand-deep border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {summaryError && !summaryLoading && (
            <p className="text-sm text-danger">Gagal memuat ringkasan.</p>
          )}

          {summary && !summaryLoading && (
            <>
              <div className="space-y-3 mb-4">
                {summary.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-brand-subtle overflow-hidden flex-shrink-0">
                      <img
                        src={item.productImg || "/placeholder.png"}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {item.productName}
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
              </div>

              {summary.shippingMethods?.length > 1 && (
                <div className="border-t border-border pt-4 mb-4">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                    Metode Pengiriman
                  </p>
                  <div className="space-y-2">
                    {summary.shippingMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedShipping === method.id
                            ? "border-brand-deep bg-brand-subtle"
                            : "border-border hover:bg-brand-subtle/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          value={method.id}
                          checked={selectedShipping === method.id}
                          onChange={() => setSelectedShipping(method.id)}
                          className="accent-brand-deep"
                        />
                        <div className="flex-1 flex items-center justify-between">
                          <span className="text-sm font-medium text-text-primary">
                            {method.name}
                          </span>
                          <span className="text-sm font-semibold text-text-primary">
                            Rp{method.cost?.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-border pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="font-medium text-text-primary">Rp{subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Ongkos Kirim</span>
                  <span className="font-medium text-text-primary">
                    {shippingCost > 0 ? `Rp${shippingCost.toLocaleString("id-ID")}` : "Gratis"}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Diskon</span>
                    <span className="font-medium">-Rp{discount.toLocaleString("id-ID")}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="font-bold text-text-primary">Total</span>
                  <span className="font-bold text-brand-deep text-lg">
                    Rp{Math.max(0, total).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <div className="border-t border-border mt-4 pt-4">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                  Kode Promo
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={appliedCode || codeInput}
                    onChange={(e) => {
                      setCodeInput(e.target.value);
                      if (appliedCode) handleRemoveCode();
                    }}
                    disabled={!!appliedCode}
                    className="input-neo flex-1 !py-2 !text-sm disabled:opacity-60"
                    placeholder="Masukkan kode promo"
                  />
                  {!appliedCode ? (
                    <button
                      onClick={handleApplyCode}
                      disabled={!codeInput.trim() || summaryUpdating}
                      className="btn-primary text-sm !py-2 !px-5"
                    >
                      Pakai
                    </button>
                  ) : (
                    <button
                      onClick={handleRemoveCode}
                      className="btn-ghost text-sm !py-2 !px-5"
                    >
                      Hapus
                    </button>
                  )}
                </div>
                {summaryUpdating && (
                  <p className="text-xs text-text-muted mt-2">Memeriksa kode...</p>
                )}
                {discountErr && (
                  <p className="text-danger text-xs mt-2">{discountErr}</p>
                )}
                {successMsg && (
                  <p className="text-success text-xs mt-2">{successMsg}</p>
                )}
              </div>
            </>
          )}
        </div>

        <button
          onClick={handleCheckout}
          disabled={!selectedAddress || !summary || checkoutMutation.isPending}
          className="btn-primary w-full text-sm !py-3 disabled:opacity-50"
        >
          {checkoutMutation.isPending ? "Memproses..." : "Buat Pesanan"}
        </button>
      </main>

      <AddressSelector
        isOpen={showAddressSelector}
        onClose={() => setShowAddressSelector(false)}
        onSelect={handleSelectAddress}
        selectedId={selectedAddress}
      />

      <Footer />
    </div>
  );
};

export default CheckoutPage;
