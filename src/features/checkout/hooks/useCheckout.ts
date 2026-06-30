import { useState, useEffect, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useOrderSummary } from "../../order/hooks/useOrderSummary";
import { useCheckoutOrder } from "../../order/hooks/useOrders";
import { useAddresses } from "../../address/hooks/useAddresses";
import { checkDiscount } from "../../discount/api/discount.api";
import type { Address } from "../../../types";

export const useCheckout = () => {
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

  return {
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
  };
};
