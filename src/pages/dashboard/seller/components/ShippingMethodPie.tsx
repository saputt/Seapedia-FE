import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { Order } from "../../../../types";

interface ShippingMethodPieProps {
  orders: Order[];
}

const METHOD_CONFIG: Record<string, { label: string; color: string }> = {
  INSTANT: { label: "Instan", color: "#EAB308" },
  NEXT_DAY: { label: "Besok", color: "#3B82F6" },
  REGULAR: { label: "Reguler", color: "#22C55E" },
};

const ShippingMethodPie = ({ orders }: ShippingMethodPieProps) => {
  const counts = Object.entries(
    orders.reduce((acc: Record<string, number>, o) => {
      const method = o.shippingMethod || "UNKNOWN";
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {})
  )
    .filter(([method]) => method !== "UNKNOWN")
    .map(([method, value]) => ({
      name: method,
      value,
    }));

  const total = counts.reduce((s, c) => s + c.value, 0);

  if (total === 0) return null;

  return (
    <div className="card !p-5">
      <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-4">
        Metode Pengiriman
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
                  <Cell
                    key={entry.name}
                    fill={METHOD_CONFIG[entry.name]?.color || "#D1D5DB"}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "2px solid #E5E7EB",
                  fontSize: "12px",
                }}
                formatter={(value: any, name: any) => [
                  value,
                  METHOD_CONFIG[name as string]?.label || name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-1.5">
          {counts.map((c) => (
            <div key={c.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-sm shrink-0"
                  style={{ backgroundColor: METHOD_CONFIG[c.name]?.color }}
                />
                <span className="text-text-primary">{METHOD_CONFIG[c.name]?.label || c.name}</span>
              </div>
              <span className="font-bold text-text-primary">{c.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShippingMethodPie;
