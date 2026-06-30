import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBuyerOrders, cancelOrder, getSellerOrders, updateOrderStatus, checkoutOrder } from "../api/order.api";
import { prependTransaction, restoreTransactions } from "../../../shared/utils/transaction";

export const useBuyerOrders = () =>
  useQuery({
    queryKey: ["buyer-orders"],
    queryFn: getBuyerOrders,
    staleTime: 0,
    refetchInterval: 15_000,
  });

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => cancelOrder(orderId),
    onMutate: async (orderId) => {
      await queryClient.cancelQueries({ queryKey: ["buyer-orders"] });
      await queryClient.cancelQueries({ queryKey: ["order", orderId] });
      await queryClient.cancelQueries({ queryKey: ["wallet"] });
      const prevBuyerOrders = queryClient.getQueryData(["buyer-orders"]);
      const prevOrder = queryClient.getQueryData(["order", orderId]);
      const prevWallet = queryClient.getQueryData(["wallet"]);
      queryClient.setQueryData(["order", orderId], (old: any) =>
        old ? { ...old, status: "CANCELLED" } : old
      );
      queryClient.setQueryData(["buyer-orders"], (old: any) => {
        if (!old) return old;
        if (Array.isArray(old)) return old.map((o: any) => o.id === orderId ? { ...o, status: "CANCELLED" } : o);
        return old;
      });
      if (prevOrder?.totalPrice && prevWallet) {
        queryClient.setQueryData(["wallet"], (old: any) => ({
          ...old,
          balance: (old.balance || 0) + prevOrder.totalPrice,
        }));
      }
      const prevTxns = prependTransaction(queryClient, {
        id: `opt-refund-${Date.now()}`,
        amount: prevOrder?.totalPrice ?? 0,
        type: "REFUND",
        description: "Refund Pembatalan Pesanan",
        createdAt: new Date().toISOString(),
      });
      return { prevBuyerOrders, prevOrder, prevWallet, prevTxns, orderId };
    },
    onError: (_err, _id, context) => {
      if (context?.prevBuyerOrders) queryClient.setQueryData(["buyer-orders"], context.prevBuyerOrders);
      if (context?.prevOrder) queryClient.setQueryData(["order", context.orderId], context.prevOrder);
      if (context?.prevWallet) queryClient.setQueryData(["wallet"], context.prevWallet);
      if (context?.prevTxns) restoreTransactions(queryClient, context.prevTxns);
    },
    onSettled: (_data, _err, orderId) => {
      queryClient.invalidateQueries({ queryKey: ["buyer-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["topSellingProducts"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

export const useSellerOrders = (params = {}) =>
  useQuery({
    queryKey: ["sellerOrders", params],
    queryFn: () => getSellerOrders(params),
    staleTime: 0,
    refetchInterval: 15_000,
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
      queryClient.invalidateQueries({ queryKey: ["availableJobs"] });
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
      queryClient.invalidateQueries({ queryKey: ["topSellingProducts"] });
    },
  });
};

export const useCheckoutOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderToken, addressId }: { orderToken: string; addressId: string; totalPrice?: number }) =>
      checkoutOrder({ orderToken, addressId }),
    onMutate: async ({ totalPrice }) => {
      await queryClient.cancelQueries({ queryKey: ["wallet"] });
      const prevWallet = queryClient.getQueryData(["wallet"]);
      if (totalPrice && prevWallet) {
        queryClient.setQueryData(["wallet"], (old: any) => ({
          ...old,
          balance: (old.balance || 0) - totalPrice,
        }));
      }
      const prevTxns = prependTransaction(queryClient, {
        id: `opt-payment-${Date.now()}`,
        amount: totalPrice ?? 0,
        type: "PAYMENT",
        description: "Pembayaran Pesanan",
        createdAt: new Date().toISOString(),
      });
      return { prevWallet, prevTxns };
    },
    onError: (_err, _vars, context) => {
      if (context?.prevWallet) queryClient.setQueryData(["wallet"], context.prevWallet);
      if (context?.prevTxns) restoreTransactions(queryClient, context.prevTxns);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["topSellingProducts"] });
      queryClient.invalidateQueries({ queryKey: ["buyer-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-summary"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
