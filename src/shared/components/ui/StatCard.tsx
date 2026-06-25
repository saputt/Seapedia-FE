import type { ReactNode } from "react";

export type StatCardProps = {
  label: string;
  value: string | number;
  variant?: "badge" | "simple";
  color?: string;
  prefix?: string;
  icon?: ReactNode;
};

const StatCard = ({ label, value, variant = "simple", color, prefix, icon }: StatCardProps) => {
  if (variant === "badge") {
    return (
      <div className="card !p-5 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${color || "bg-brand-deep"} flex items-center justify-center shrink-0`}>
          {icon ?? <span className="text-white text-lg font-bold">{value}</span>}
        </div>
        <div>
          <p className="text-sm text-text-muted">{label}</p>
          <p className="text-xl font-bold text-text-primary">{value}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color || "text-text-primary"}`}>
        {prefix || ""}{typeof value === "number" ? value.toLocaleString("id-ID") : value ?? 0}
      </p>
    </div>
  );
};

export default StatCard;
