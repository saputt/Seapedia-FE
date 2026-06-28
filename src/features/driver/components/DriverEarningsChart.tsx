import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface DriverEarningsChartProps {
  jobs: any[];
}

function toDateStr(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}`;
}

const DriverEarningsChart = ({ jobs }: DriverEarningsChartProps) => {
  const data = useMemo(() => {
    const today = new Date();
    const days: { label: string; earnings: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      days.push({ label: toDateStr(d), earnings: 0 });
    }

    const delivered = jobs.filter((j: any) => j.status === "DELIVERED");

    delivered.forEach((j: any) => {
      const doneAt = j.driverJob?.doneAt ? new Date(j.driverJob.doneAt).getTime() : 0;
      if (!doneAt) return;
      const dayStart = new Date(new Date(doneAt).getFullYear(), new Date(doneAt).getMonth(), new Date(doneAt).getDate()).getTime();
      const idx = days.findIndex((d) => {
        const ds = new Date(today.getFullYear(), today.getMonth(), parseInt(d.label.split("/")[0])).getTime();
        return ds === dayStart;
      });
      if (idx !== -1) {
        days[idx].earnings += j.driverJob?.earning || 0;
      }
    });

    return days;
  }, [jobs]);

  const maxEarnings = Math.max(...data.map((d) => d.earnings));
  const yMax = maxEarnings > 0 ? Math.ceil(maxEarnings * 1.2 / 1000) * 1000 : 10000;

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
              dataKey="earnings"
              stroke="#059669"
              strokeWidth={2}
              dot={{ fill: "#059669", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#059669", strokeWidth: 2, stroke: "#fff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DriverEarningsChart;
