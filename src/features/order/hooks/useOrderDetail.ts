import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "../api/order.api";

export const useOrderDetail = (orderId: string) =>
  useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
  });
