import type { OrderStatus, ShippingMethod, ShippingOption } from "../../types";

export const STATUS_LABEL: Record<OrderStatus, string> & { [key: string]: string } = {
  PENDING: "Menunggu Konfirmasi",
  READY_FOR_DELIVERY: "Siap Dikirim",
  ON_DELIVERY: "Dalam Pengiriman",
  DELIVERED: "Diterima",
  CANCELLED: "Dibatalkan",
};

export const STATUS_COLOR: Record<OrderStatus, string> & { [key: string]: string } = {
  PENDING: "text-warning",
  READY_FOR_DELIVERY: "text-info",
  ON_DELIVERY: "text-info",
  DELIVERED: "text-success",
  CANCELLED: "text-danger",
};

export const SHIPPING_LABEL: Record<ShippingMethod, string> & { [key: string]: string } = {
  REGULAR: "Reguler",
  INSTANT: "Instan",
  NEXT_DAY: "Besok",
};

export const SHIPPING_COLOR: Record<ShippingMethod, string> & { [key: string]: string } = {
  INSTANT: "text-warning",
  NEXT_DAY: "text-info",
  REGULAR: "text-text-primary",
};

export const SHIPPING_LIST: ShippingOption[] = [
  { id: "REGULAR", name: "Regular", price: 10000, desc: "Estimasi 3\u20135 hari" },
  { id: "INSTANT", name: "Instant", price: 15000, desc: "Estimasi 1\u20132 hari" },
  { id: "NEXT_DAY", name: "Next Day", price: 20000, desc: "Besok sampai" },
];
