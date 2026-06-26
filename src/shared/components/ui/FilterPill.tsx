interface FilterPillItem {
  key: string;
  label: string;
}

interface FilterPillProps {
  items: FilterPillItem[];
  value: string;
  onChange: (key: string) => void;
  className?: string;
}

const FilterPill = ({ items, value, onChange, className = "" }: FilterPillProps) => (
  <div className={`flex flex-wrap gap-2 ${className}`}>
    {items.map((item) => (
      <button
        key={item.key}
        onClick={() => onChange(item.key)}
        className={`text-xs font-bold px-3 py-1.5 rounded-lg border-[3px] border-brand-deep transition-all duration-100 ${
          value === item.key
            ? "bg-brand-deep text-white shadow-[3px_3px_0px_0px_var(--color-brand-deep)]"
            : "bg-white text-text-secondary shadow-[3px_3px_0px_0px_var(--color-brand-deep)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0px_0px_var(--color-brand-deep)]"
        }`}
      >
        {item.label}
      </button>
    ))}
  </div>
);

export default FilterPill;
