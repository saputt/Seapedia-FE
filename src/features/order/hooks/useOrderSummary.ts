import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getOrderSummary } from "../api/order.api";

export const useOrderSummary = (discountCode?: string, shippingMethod?: string) =>
  useQuery({
    queryKey: ["order-summary", discountCode, shippingMethod],
    queryFn: () => getOrderSummary({ discountCode, shippingMethod } as any),
    placeholderData: keepPreviousData,
    retry: false,
  });
