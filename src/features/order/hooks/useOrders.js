import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBuyerOrders, cancelOrder, getSellerOrders, updateOrderStatus } from "../api/order.api";

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

export const useSellerOrders = (params = {}) =>
  useQuery({
    queryKey: ["sellerOrders", params],
    queryFn: () => getSellerOrders(params),
  });

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, storeId }) => updateOrderStatus(orderId, storeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerOrders"] });
    },
  });
};

export const useBuyerConfirmOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, storeId }) => updateOrderStatus(orderId, storeId),
    onSuccess: (_data, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ["buyer-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },
  });
};
