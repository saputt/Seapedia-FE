import { apiFetch } from "../../../api/client";
import type {
  CheckoutInput,
  Order,
  OrderSummary,
  OrderStatus,
  ShippingMethod,
} from "../../../types";

export interface OrderSummaryInput {
  items: Array<{ productId: string; quantity: number }>;
  shippingMethod: ShippingMethod;
  discountCode?: string;
}

interface SellerOrderParams {
  status?: OrderStatus;
  orderBy?: string;
}

export const getOrderSummary = (data: OrderSummaryInput): Promise<OrderSummary> =>
  apiFetch("orders/summary", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const checkoutOrder = (data: CheckoutInput): Promise<Order> =>
  apiFetch("orders/checkout", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getBuyerOrders = (): Promise<Order[]> => apiFetch("orders/buyer");

export const getSellerOrders = (params: SellerOrderParams = {}): Promise<Order[]> => {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.orderBy) query.set("orderBy", params.orderBy);
  const qs = query.toString();
  return apiFetch(`orders/seller${qs ? `?${qs}` : ""}`);
};

export const getOrderById = (orderId: string): Promise<Order> => apiFetch(`orders/${orderId}`);

export const cancelOrder = (orderId: string): Promise<void> =>
  apiFetch(`orders/${orderId}/cancel`, { method: "PATCH" });

export const updateOrderStatus = (orderId: string, storeId: string): Promise<Order> =>
  apiFetch(`orders/${orderId}/progress`, {
    method: "PATCH",
    body: JSON.stringify({ storeId }),
  });
