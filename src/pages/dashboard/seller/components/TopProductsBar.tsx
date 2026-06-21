import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { Order } from "../../../../types";

interface TopProductsBarProps {
  orders: Order[];
}

const COLORS = ["#2563EB", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE"];

const TopProductsBar = ({ orders }: TopProductsBarProps) => {
  const delivered = orders.filter((o) => o.status === "DELIVERED");

  const productMap = new Map<string, { name: string; sold: number }>();

  delivered.forEach((o) => {
    const items = (o as any).orderItems ?? (o as any).items ?? [];
    items.forEach((item: any) => {
      const existing = productMap.get(item.productId);
      if (existing) {
        existing.sold += item.quantity;
      } else {
        productMap.set(item.productId, {
          name: item.product?.name ?? "Produk",
          sold: item.quantity,
        });
      }
    });
  });

  const data = Array.from(productMap.entries())
    .map(([id, d]) => ({ id, ...d }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 6);

  if (data.length === 0) return null;

  const maxSold = Math.max(...data.map((d) => d.sold));

  return (
    <div className="card !p-5">
      <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-4">
        Produk Terlaris
      </h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
            <XAxis type="number" hide domain={[0, maxSold + 5]} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: "#374151" }}
              tickLine={false}
              axisLine={false}
              width={90}
            />
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "2px solid #E5E7EB", fontSize: "12px" }}
              formatter={(value: any) => [`${value} terjual`, "Terjual"]}
            />
            <Bar dataKey="sold" radius={[0, 4, 4, 0]} barSize={16}>
              {data.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopProductsBar;
