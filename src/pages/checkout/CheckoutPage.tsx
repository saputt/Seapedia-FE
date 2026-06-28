import React, { useState, useEffect, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "../../shared/components/layout/MainLayout";
import AlertModal from "../../shared/components/ui/AlertModal";
import Button from "../../shared/components/ui/Button";
import AddressSelector from "../../features/order/components/AddressSelector";
import CheckoutShippingSelector from "../../features/checkout/components/CheckoutShippingSelector";
import CheckoutSummaryCard from "../../features/checkout/components/CheckoutSummaryCard";
import CheckoutAddressSection from "../../features/checkout/components/CheckoutAddressSection";
import CheckoutItemsList from "../../features/checkout/components/CheckoutItemsList";
import CheckoutDiscountSection from "../../features/checkout/components/CheckoutDiscountSection";
import { useOrderSummary } from "../../features/order/hooks/useOrderSummary";
import { useCheckoutOrder } from "../../features/order/hooks/useOrders";
import { useAddresses } from "../../features/address/hooks/useAddresses";
import { checkDiscount } from "../../features/discount/api/discount.api";
import type { Address } from "../../types";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const directBuyItems = useMemo(() => {
    const buyNow = searchParams.get("buyNow");
    const productId = searchParams.get("productId");
    const quantity = searchParams.get("quantity");
    if (buyNow === "1" && productId) {
      return [{ productId, quantity: Number(quantity) || 1 }];
    }
    return undefined;
  }, [searchParams]);

  const [shippingMethod, setShippingMethod] = useState("REGULAR");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [discountCheckError, setDiscountCheckError] = useState("");

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressSelector, setShowAddressSelector] = useState(false);

  const [showInsufficientModal, setShowInsufficientModal] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const { data: summaryData, isLoading, isFetching, error: summaryError, refetch } = useOrderSummary(appliedCode, shippingMethod, directBuyItems);
  const summary = (summaryData as any)?.order ?? null;
  const orderToken = (summaryData as any)?.orderToken ?? null;

  const { data: addressesData } = useAddresses(true);

  useEffect(() => {
    if (isLoading || !addressesData) return;
    const addrs = Array.isArray(addressesData) ? addressesData : [];
    const defaultAddr = addrs.find((a) => a.lastUsed) ?? addrs[0] ?? null;
    if (defaultAddr) setSelectedAddress(defaultAddr);
  }, [isLoading, addressesData]);

  const summaryErrorMessage = summaryError?.message || "";
  const discountErrorMsg = !appliedCode || !summaryError ? "" :
    summaryErrorMessage.toLowerCase().includes("not found") ? "Kode diskon tidak ditemukan." :
    (summaryErrorMessage.toLowerCase().includes("expired") || summaryErrorMessage.toLowerCase().includes("not available")) ? "Kode diskon sudah tidak berlaku." :
    summaryErrorMessage;

  const checkoutMutation = useCheckoutOrder();

  const handleCheckout = () => {
    if (checkoutMutation.isPending) return;
    if (!selectedAddress) {
      setCheckoutError("Silakan pilih alamat pengiriman terlebih dahulu.");
      return;
    }
    if (!orderToken) {
      setCheckoutError("Ringkasan pesanan tidak valid. Silakan refresh.");
      return;
    }
    setCheckoutError("");
    const currentTotalPrice = summary?.totalPrice ?? 0;
    checkoutMutation.mutate(
      { orderToken, addressId: selectedAddress.id, totalPrice: currentTotalPrice },
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

  const checkDiscountMutation = useMutation({
    mutationFn: (code: string) => checkDiscount(code),
    retry: false,
  });

  const handleApplyDiscount = () => {
    const trimmed = discountCode.trim().toUpperCase();
    if (!trimmed) return;
    setDiscountCheckError("");
    checkDiscountMutation.mutate(trimmed, {
      onSuccess: () => {
        setAppliedCode(trimmed);
        setDiscountCode("");
      },
      onError: (err: Error) => {
        const msg = err?.message || "";
        if (msg.toLowerCase().includes("not found")) {
          setDiscountCheckError("Kode diskon tidak ditemukan.");
        } else if (msg.toLowerCase().includes("expired") || msg.toLowerCase().includes("not available")) {
          setDiscountCheckError("Kode diskon sudah tidak berlaku.");
        } else {
          setDiscountCheckError("Gagal memvalidasi diskon. Silakan coba lagi.");
        }
      },
    });
  };

  const handleRemoveDiscount = () => {
    setDiscountCode("");
    setAppliedCode("");
    setDiscountCheckError("");
  };

  const handleDiscountKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleApplyDiscount();
  };

  const subtotal = summary?.subtotal ?? 0;
  const discountValue = summary?.discountValue ?? 0;
  const shippingFee = summary?.shippingFee ?? 0;
  const taxFee = summary?.taxFee ?? 0;
  const totalPrice = summary?.totalPrice ?? 0;

  return (
    <MainLayout navbarVariant="checkout">
      <div className="max-w-[960px] mx-auto w-full px-3 lg:px-8 py-8">
        {isLoading && (
          <div className="space-y-6 animate-pulse">
            <div className="card h-24 bg-bg-tertiary" />
            <div className="card h-48 bg-bg-tertiary" />
            <div className="card h-32 bg-bg-tertiary" />
          </div>
        )}

        {!summary && summaryError && !isLoading && (
          <div className="text-center py-20">
            <p className="text-danger font-semibold text-lg mb-4">
              {(summaryError as Error)?.message || "Gagal memuat ringkasan pesanan."}
            </p>
            <Button onClick={() => refetch()} variant="primary" size="sm">
              Coba Lagi
            </Button>
          </div>
        )}

        {summary && (
          <div className="space-y-6">
            <CheckoutAddressSection
              selectedAddress={selectedAddress}
              onSelectClick={() => setShowAddressSelector(true)}
            />

            <CheckoutItemsList items={summary.products ?? []} />

            <CheckoutDiscountSection
              discountCode={discountCode}
              appliedCode={appliedCode}
              discountValue={discountValue}
              discountCheckError={discountCheckError}
              discountErrorMsg={discountErrorMsg}
              isPending={checkDiscountMutation.isPending}
              onCodeChange={setDiscountCode}
              onApply={handleApplyDiscount}
              onRemove={handleRemoveDiscount}
              onKeyDown={handleDiscountKeyDown}
            />

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

            {checkoutError && (
              <p className="text-danger text-sm text-center">{checkoutError}</p>
            )}
            <Button
              onClick={handleCheckout}
              variant="primary"
              size="lg"
              fullWidth
              loading={checkoutMutation.isPending}
              disabled={checkoutMutation.isPending || !selectedAddress}
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
        onAction={() => navigate("/wallet")}
      />
    </MainLayout>
  );
};

export default CheckoutPage;
