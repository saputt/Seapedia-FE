import React from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../shared/components/layout/MainLayout";
import AlertModal from "../../shared/components/ui/AlertModal";
import Button from "../../shared/components/ui/Button";
import AddressSelector from "../../features/order/components/AddressSelector";
import CheckoutShippingSelector from "../../features/checkout/components/CheckoutShippingSelector";
import CheckoutSummaryCard from "../../features/checkout/components/CheckoutSummaryCard";
import CheckoutAddressSection from "../../features/checkout/components/CheckoutAddressSection";
import CheckoutItemsList from "../../features/checkout/components/CheckoutItemsList";
import CheckoutDiscountSection from "../../features/checkout/components/CheckoutDiscountSection";
import { useCheckout } from "../../features/checkout/hooks/useCheckout";
import type { Address } from "../../types";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    summary,
    isLoading,
    isFetching,
    summaryError,
    refetch,
    selectedAddress,
    showAddressSelector,
    setShowAddressSelector,
    shippingMethod,
    setShippingMethod,
    discountCode,
    setDiscountCode,
    appliedCode,
    discountCheckError,
    discountErrorMsg,
    discountValue,
    checkoutError,
    showInsufficientModal,
    setShowInsufficientModal,
    subtotal,
    shippingFee,
    taxFee,
    totalPrice,
    checkoutMutation,
    checkDiscountMutation,
    handleCheckout,
    handleApplyDiscount,
    handleRemoveDiscount,
    handleDiscountKeyDown,
  } = useCheckout();

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
