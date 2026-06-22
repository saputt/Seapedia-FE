import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../shared/components/layout/MainLayout";
import AlertModal from "../../shared/components/ui/AlertModal";
import Button from "../../shared/components/ui/Button";
import AddressSelector from "../../features/order/components/AddressSelector";
import CheckoutShippingSelector from "../../features/checkout/components/CheckoutShippingSelector";
import CheckoutSummaryCard from "../../features/checkout/components/CheckoutSummaryCard";
import { useOrderSummary } from "../../features/order/hooks/useOrderSummary";
import { useCheckoutOrder } from "../../features/order/hooks/useOrders";
import { useAddresses } from "../../features/address/hooks/useAddresses";
import type { Address } from "../../types";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();

  const [shippingMethod, setShippingMethod] = useState("REGULAR");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedCode, setAppliedCode] = useState("");

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressSelector, setShowAddressSelector] = useState(false);

  const [showInsufficientModal, setShowInsufficientModal] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const { data: summaryData, isLoading, isFetching, error: summaryError, refetch } = useOrderSummary(appliedCode, shippingMethod);
  const summary = (summaryData as any)?.order ?? null;
  const orderToken = (summaryData as any)?.orderToken ?? null;

  const { data: addressesData } = useAddresses(true);

  const initialAddressSet = useRef(false);
  useEffect(() => {
    if (isLoading || initialAddressSet.current || !addressesData) return;
    const addr = Array.isArray(addressesData) ? addressesData[0] : null;
    if (addr) {
      setSelectedAddress(addr);
      initialAddressSet.current = true;
    }
  }, [isLoading, addressesData]);

  const summaryErrorMessage = summaryError?.message || "";
  const discountErrorMsg = !appliedCode ? "" :
    summaryErrorMessage.toLowerCase().includes("not found") ? "Kode diskon tidak ditemukan." :
    (summaryErrorMessage.toLowerCase().includes("expired") || summaryErrorMessage.toLowerCase().includes("not available")) ? "Kode diskon sudah tidak berlaku." :
    summaryErrorMessage || "Gagal menerapkan diskon.";

  const checkoutMutation = useCheckoutOrder();

  const handleCheckout = () => {
    if (!selectedAddress) {
      setCheckoutError("Silakan pilih alamat pengiriman terlebih dahulu.");
      return;
    }
    if (!orderToken) {
      setCheckoutError("Ringkasan pesanan tidak valid. Silakan refresh.");
      return;
    }
    setCheckoutError("");
    checkoutMutation.mutate(
      { orderToken, addressId: selectedAddress.id },
      {
        onSuccess: () => {
          navigate("/checkout/success");
        },
        onError: (err: Error) => {
          const msg = err?.message || "";
          if (msg.toLowerCase().includes("not sufficient")) {
            setShowInsufficientModal(true);
            setCheckoutError("");
          } else {
            setCheckoutError(msg || "Checkout gagal. Silakan coba lagi.");
          }
        },
      }
    );
  };

  const handleApplyDiscount = () => {
    const trimmed = discountCode.trim().toUpperCase();
    if (!trimmed) return;
    setAppliedCode(trimmed);
  };

  const handleRemoveDiscount = () => {
    setDiscountCode("");
    setAppliedCode("");
  };

  const subtotal = summary?.subtotal ?? 0;
  const discountValue = summary?.discountValue ?? 0;
  const shippingFee = summary?.shippingFee ?? 0;
  const taxFee = summary?.taxFee ?? 0;
  const totalPrice = summary?.totalPrice ?? 0;

  return (
    <MainLayout navbarVariant="checkout">
      <div className="max-w-[960px] mx-auto w-full px-6 lg:px-8 py-8">
        {isLoading && (
          <div className="space-y-6 animate-pulse">
            <div className="card h-24 bg-bg-tertiary" />
            <div className="card h-48 bg-bg-tertiary" />
            <div className="card h-32 bg-bg-tertiary" />
          </div>
        )}

        {summaryError && !isLoading && (
          <div className="text-center py-20">
            <p className="text-danger font-semibold text-lg mb-4">
              {(summaryError as Error)?.message || "Gagal memuat ringkasan pesanan."}
            </p>
            <Button onClick={() => refetch()} variant="primary" size="sm">
              Coba Lagi
            </Button>
          </div>
        )}

        {!isLoading && !summaryError && summary && (
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
                    {selectedAddress.fullAddress}
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
                  <Button
                    onClick={() => setShowAddressSelector(true)}
                    variant="primary"
                  >
                    Pilih Alamat
                  </Button>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="card">
              <h2 className="text-sm font-bold text-text-primary mb-3">
                Produk ({summary.products?.length || 0})
              </h2>
              <div className="space-y-3">
                {summary.products?.map((item: { productId: string; imageUrl?: string; name: string; price: number; quantity: number; totalItemPrice: number }) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-3"
                  >
                    <div className="w-14 h-14 bg-bg-tertiary rounded flex items-center justify-center overflow-hidden shrink-0">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          loading="lazy"
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
                  <Button
                    onClick={handleApplyDiscount}
                    variant="primary"
                    size="sm"
                    disabled={!discountCode.trim()}
                  >
                    Pakai
                  </Button>
                </div>
              )}
              {discountErrorMsg && (
                <p className="text-danger text-xs mt-1">{discountErrorMsg}</p>
              )}
              {appliedCode && !discountErrorMsg && (
                <p className="text-success text-xs mt-1">Diskon {appliedCode} berhasil diterapkan!</p>
              )}
            </div>

            <CheckoutShippingSelector
              shippingMethod={shippingMethod}
              isFetching={isFetching}
              onChange={setShippingMethod}
            />

            <CheckoutSummaryCard
              subtotal={subtotal}
              discountValue={discountValue}
              shippingFee={shippingFee}
              taxFee={taxFee}
              totalPrice={totalPrice}
            />

            {/* Checkout Button */}
            {checkoutError && (
              <p className="text-danger text-sm text-center">{checkoutError}</p>
            )}
            <Button
              onClick={handleCheckout}
              variant="primary"
              size="lg"
              fullWidth
              loading={checkoutMutation.isPending}
              disabled={!selectedAddress}
            >
              {checkoutMutation.isPending ? "Memproses..." : "Buat Pesanan"}
            </Button>
          </div>
        )}
      </div>

      <AddressSelector
        isOpen={showAddressSelector}
        onClose={() => setShowAddressSelector(false)}
        onSelect={(addr: Address) => {
          setSelectedAddress(addr);
          setShowAddressSelector(false);
        }}
        selectedId={selectedAddress?.id ?? ""}
      />

      <AlertModal
        isOpen={showInsufficientModal}
        onClose={() => setShowInsufficientModal(false)}
        title="Saldo Tidak Cukup"
        message="Saldo dompet Anda tidak mencukupi untuk melakukan checkout. Silakan top up terlebih dahulu."
        actionLabel="Top Up"
        onAction={() => navigate("/dashboard/buyer/wallet")}
      />
    </MainLayout>
  );
};

export default CheckoutPage;
