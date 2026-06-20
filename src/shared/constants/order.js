export const STATUS_LABEL = {
  PENDING: "Menunggu Konfirmasi",
  READY_FOR_DELIVERY: "Siap Dikirim",
  ON_DELIVERY: "Dalam Pengiriman",
  DELIVERED: "Diterima",
  CANCELLED: "Dibatalkan",
};

export const STATUS_COLOR = {
  PENDING: "text-warning",
  READY_FOR_DELIVERY: "text-info",
  ON_DELIVERY: "text-info",
  DELIVERED: "text-success",
  CANCELLED: "text-danger",
};

export const SHIPPING_LABEL = {
  REGULAR: "Reguler",
  INSTANT: "Instan",
  NEXT_DAY: "Besok",
};

export const SHIPPING_COLOR = {
  INSTANT: "text-warning",
  NEXT_DAY: "text-info",
  REGULAR: "text-text-primary",
};

export const SHIPPING_LIST = [
  { id: "REGULAR", name: "Regular", price: 10000, desc: "Estimasi 3–5 hari" },
  { id: "INSTANT", name: "Instant", price: 15000, desc: "Estimasi 1–2 hari" },
  { id: "NEXT_DAY", name: "Next Day", price: 20000, desc: "Besok sampai" },
];
