import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getOrderSummary } from "../api/order.api";

export const useOrderSummary = (
  discountCode?: string,
  shippingMethod?: string,
  items?: Array<{ productId: string; quantity: number }>
) =>
  useQuery({
    queryKey: ["order-summary", discountCode, shippingMethod, items],
    queryFn: () => getOrderSummary({ items, discountCode, shippingMethod } as any),
    placeholderData: keepPreviousData,
    retry: false,
    staleTime: 0,
  });
