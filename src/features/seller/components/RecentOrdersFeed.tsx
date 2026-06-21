import { Link } from "react-router-dom";
import type { Order } from "../../../types";

interface RecentOrdersFeedProps {
  orders: Order[];
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Menunggu",
  READY_FOR_DELIVERY: "Siap Kirim",
  ON_DELIVERY: "Dalam Pengiriman",
  DELIVERED: "Selesai",
  CANCELLED: "Dibatalkan",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-warning text-warning border-warning",
  READY_FOR_DELIVERY: "bg-blue-50 text-blue-600 border-blue-500",
  ON_DELIVERY: "bg-purple-50 text-purple-600 border-purple-500",
  DELIVERED: "bg-green-50 text-green-700 border-green-600",
  CANCELLED: "bg-red-50 text-danger border-danger",
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  return new Date(dateStr).toLocaleDateString("id-ID");
}

const RecentOrdersFeed = ({ orders }: RecentOrdersFeedProps) => {
  const recent = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 7);

  if (recent.length === 0) {
    return null;
  }

  return (
    <div className="card !p-5">
      <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-4">
        Pesanan Terbaru
      </h3>
      <div className="space-y-1">
        {recent.map((order) => (
          <div
            key={order.id}
            className="flex items-center gap-3 py-2.5 border-b-2 border-border-default last:border-b-0"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                #{order.id.slice(0, 8)}
              </p>
              <p className="text-xs text-text-muted">{timeAgo(order.createdAt)}</p>
            </div>
            <span
              className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-md border-3 ${
                STATUS_COLORS[order.status] || "bg-gray-50 text-gray-600 border-gray-400"
              }`}
            >
              {STATUS_LABELS[order.status] || order.status}
            </span>
            <p className="shrink-0 text-sm font-bold text-text-primary">
              Rp{((order as any).totalPrice ?? order.total ?? 0).toLocaleString("id-ID")}
            </p>
          </div>
        ))}
      </div>
      <Link
        to="/dashboard/seller/orders"
        className="block text-center text-xs font-semibold text-brand-deep mt-3 pt-3 border-t-3 border-border-default hover:opacity-80 transition-opacity"
      >
        Lihat semua pesanan →
      </Link>
    </div>
  );
};

export default RecentOrdersFeed;
