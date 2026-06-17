import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBuyerOrders, cancelOrder } from "../api/order.api";

export const useBuyerOrders = () =>
  useQuery({
    queryKey: ["buyer-orders"],
    queryFn: getBuyerOrders,
  });

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId) => cancelOrder(orderId),
    onSuccess: (_data, orderId) => {
      queryClient.invalidateQueries({ queryKey: ["buyer-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },
  });
};
