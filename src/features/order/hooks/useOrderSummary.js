import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getOrderSummary } from "../api/order.api";

export const useOrderSummary = (discountCode, shippingMethod) =>
  useQuery({
    queryKey: ["order-summary", discountCode, shippingMethod],
    queryFn: () => getOrderSummary({ discountCode, shippingMethod }),
    placeholderData: keepPreviousData,
    retry: false,
  });
