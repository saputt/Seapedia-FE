import { queryClient } from "@/shared/lib/queryClient";
import { getProductById } from "@/features/catalog/api/catalog.api";
import { getStoreById, getMyStore } from "@/features/store/api/store.api";
import { getOrderById, getOrderSummary, type OrderSummaryInput } from "@/features/order/api/order.api";
import { getAdminDashboard } from "@/features/admin/api/admin.api";

export const prefetchProductDetail = (id: string) => {
  queryClient.prefetchQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    staleTime: 5 * 60 * 1000,
  });
};

export const prefetchStore = (storeId: string) => {
  queryClient.prefetchQuery({
    queryKey: ["store", storeId],
    queryFn: () => getStoreById(storeId),
    staleTime: 5 * 60 * 1000,
  });
};

export const prefetchMyStore = () => {
  queryClient.prefetchQuery({
    queryKey: ["myStore"],
    queryFn: getMyStore,
    staleTime: 5 * 60 * 1000,
  });
};

export const prefetchOrderDetail = (orderId: string) => {
  queryClient.prefetchQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    staleTime: 5 * 60 * 1000,
  });
};

export const prefetchOrderSummary = (data: OrderSummaryInput) => {
  queryClient.prefetchQuery({
    queryKey: ["order-summary", data],
    queryFn: () => getOrderSummary(data),
    staleTime: 5 * 60 * 1000,
  });
};

export const prefetchAdminDashboard = () => {
  queryClient.prefetchQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: getAdminDashboard,
    staleTime: 5 * 60 * 1000,
  });
};
