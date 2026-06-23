import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBuyerOrders, cancelOrder, getSellerOrders, updateOrderStatus, checkoutOrder } from "../api/order.api";

export const useBuyerOrders = () =>
  useQuery({
    queryKey: ["buyer-orders"],
    queryFn: getBuyerOrders,
  });

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => cancelOrder(orderId),
    onMutate: async (orderId) => {
      await queryClient.cancelQueries({ queryKey: ["buyer-orders"] });
      await queryClient.cancelQueries({ queryKey: ["order", orderId] });
      const prevBuyerOrders = queryClient.getQueryData(["buyer-orders"]);
      const prevOrder = queryClient.getQueryData(["order", orderId]);
      queryClient.setQueryData(["order", orderId], (old: any) =>
        old ? { ...old, status: "CANCELLED" } : old
      );
      queryClient.setQueryData(["buyer-orders"], (old: any) => {
        if (!old) return old;
        if (Array.isArray(old)) return old.map((o: any) => o.id === orderId ? { ...o, status: "CANCELLED" } : o);
        return old;
      });
      return { prevBuyerOrders, prevOrder, orderId };
    },
    onError: (_err, _id, context) => {
      if (context?.prevBuyerOrders) queryClient.setQueryData(["buyer-orders"], context.prevBuyerOrders);
      if (context?.prevOrder) queryClient.setQueryData(["order", context.orderId], context.prevOrder);
    },
    onSettled: (_data, _err, orderId) => {
      queryClient.invalidateQueries({ queryKey: ["buyer-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
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
    mutationFn: ({ orderId, storeId }: { orderId: string; storeId: string }) =>
      updateOrderStatus(orderId, storeId),
    onMutate: async ({ orderId }) => {
      await queryClient.cancelQueries({ queryKey: ["sellerOrders"] });
      const previous = queryClient.getQueryData(["sellerOrders"]);
      queryClient.setQueryData(["sellerOrders"], (old: any) => {
        if (!old) return old;
        if (Array.isArray(old)) return old.map((o: any) => o.id === orderId ? { ...o, status: "PROCESSING" } : o);
        return old;
      });
      return { previous };
    },
    onError: (_err, _params, context) => {
      if (context?.previous) queryClient.setQueryData(["sellerOrders"], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerOrders"] });
    },
  });
};

export const useBuyerConfirmOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, storeId }: { orderId: string; storeId: string }) =>
      updateOrderStatus(orderId, storeId),
    onMutate: async ({ orderId }) => {
      await queryClient.cancelQueries({ queryKey: ["buyer-orders"] });
      await queryClient.cancelQueries({ queryKey: ["order", orderId] });
      const prevBuyerOrders = queryClient.getQueryData(["buyer-orders"]);
      const prevOrder = queryClient.getQueryData(["order", orderId]);
      queryClient.setQueryData(["order", orderId], (old: any) =>
        old ? { ...old, status: "CONFIRMED" } : old
      );
      queryClient.setQueryData(["buyer-orders"], (old: any) => {
        if (!old) return old;
        if (Array.isArray(old)) return old.map((o: any) => o.id === orderId ? { ...o, status: "CONFIRMED" } : o);
        return old;
      });
      return { prevBuyerOrders, prevOrder, orderId };
    },
    onError: (_err, _params, context) => {
      if (context?.prevBuyerOrders) queryClient.setQueryData(["buyer-orders"], context.prevBuyerOrders);
      if (context?.prevOrder) queryClient.setQueryData(["order", context.orderId], context.prevOrder);
    },
    onSettled: (_data, _err, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ["buyer-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },
  });
};

export const useCheckoutOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderToken, addressId }: { orderToken: string; addressId: string }) =>
      checkoutOrder({ orderToken, addressId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["buyer-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-summary"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
