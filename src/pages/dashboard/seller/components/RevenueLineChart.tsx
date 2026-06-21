import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { Order } from "../../../../types";

interface RevenueLineChartProps {
  orders: Order[];
}

function toDateStr(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}`;
}

const RevenueLineChart = ({ orders }: RevenueLineChartProps) => {
  const data = useMemo(() => {
    const today = new Date();
    const days: { date: Date; label: string; revenue: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      days.push({ date: d, label: toDateStr(d), revenue: 0 });
    }

    const delivered = orders.filter((o) => o.status === "DELIVERED");

    delivered.forEach((o) => {
      const orderDate = new Date(o.createdAt);
      const dayStart = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate()).getTime();
      const idx = days.findIndex((d) => {
        const ds = new Date(d.date.getFullYear(), d.date.getMonth(), d.date.getDate()).getTime();
        return ds === dayStart;
      });
      if (idx !== -1) {
        const revenue = (o as any).totalPrice ?? o.subtotal ?? 0;
        days[idx].revenue += revenue;
      }
    });

    return days;
  }, [orders]);

  const hasData = data.some((d) => d.revenue > 0);
  if (!hasData) return null;

  const maxRevenue = Math.max(...data.map((d) => d.revenue));
  const yMax = maxRevenue > 0 ? Math.ceil(maxRevenue * 1.2 / 10000) * 10000 : 10000;

  return (
    <div className="card !p-5">
      <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-4">
        Pendapatan 7 Hari Terakhir
      </h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#6B7280" }}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6B7280" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `Rp${(v / 1000).toFixed(0)}k`}
              domain={[0, yMax]}
            />
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "2px solid #E5E7EB", fontSize: "12px" }}
              formatter={(value: any) => [`Rp${(value as number).toLocaleString("id-ID")}`, "Pendapatan"]}
              labelFormatter={(label: any) => `${label}`}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#2563EB"
              strokeWidth={2}
              dot={{ fill: "#2563EB", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#2563EB", strokeWidth: 2, stroke: "#fff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueLineChart;
