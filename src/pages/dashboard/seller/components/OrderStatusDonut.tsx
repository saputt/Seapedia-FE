import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { Order } from "../../../../types";

interface OrderStatusDonutProps {
  orders: Order[];
}

const STATUS_ORDER = ["PENDING", "READY_FOR_DELIVERY", "ON_DELIVERY", "DELIVERED", "CANCELLED"];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Menunggu", color: "#EAB308" },
  READY_FOR_DELIVERY: { label: "Siap Dikirim", color: "#3B82F6" },
  ON_DELIVERY: { label: "Dikirim", color: "#8B5CF6" },
  DELIVERED: { label: "Selesai", color: "#22C55E" },
  CANCELLED: { label: "Dibatalkan", color: "#EF4444" },
};

const OrderStatusDonut = ({ orders }: OrderStatusDonutProps) => {
  const counts = STATUS_ORDER.map((status) => ({
    name: status,
    value: orders.filter((o) => o.status === status).length,
  }));

  const total = counts.reduce((s, c) => s + c.value, 0);

  if (total === 0) return null;

  return (
    <div className="card !p-5">
      <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-4">
        Status Pesanan
      </h3>
      <div className="flex items-center gap-4">
        <div className="w-40 h-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={counts}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={60}
                dataKey="value"
                strokeWidth={0}
              >
                {counts.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_CONFIG[entry.name]?.color || "#D1D5DB"} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "2px solid #E5E7EB",
                  fontSize: "12px",
                }}
                formatter={(value: any, name: any) => [value, STATUS_CONFIG[name as string]?.label || name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-1.5">
          {counts.filter((c) => c.value > 0).map((c) => (
            <div key={c.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-sm shrink-0"
                  style={{ backgroundColor: STATUS_CONFIG[c.name]?.color }}
                />
                <span className="text-text-primary">{STATUS_CONFIG[c.name]?.label || c.name}</span>
              </div>
              <span className="font-bold text-text-primary">{c.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderStatusDonut;
