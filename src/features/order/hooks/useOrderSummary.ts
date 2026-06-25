import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useMemo } from "react";
import { getOrderSummary } from "../api/order.api";

export const useOrderSummary = (
  discountCode?: string,
  shippingMethod?: string,
  items?: Array<{ productId: string; quantity: number }>
) => {
  const itemsKey = useMemo(() => items ? JSON.stringify(items) : undefined, [items]);
  
  return useQuery({
    queryKey: ["order-summary", discountCode, shippingMethod, itemsKey],
    queryFn: () => getOrderSummary({ items, discountCode, shippingMethod } as any),
    placeholderData: keepPreviousData,
    retry: false,
    staleTime: 0,
  });
};
