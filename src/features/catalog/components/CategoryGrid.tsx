import { CATEGORY_SHORT } from "../../../shared/constants/product";
import { CATEGORY_ICONS } from "../../../shared/constants/productIcons";

interface CategoryGridProps {
  categoryFilter: string;
  onCategoryClick: (key: string) => void;
}

const CategoryGrid = ({ categoryFilter, onCategoryClick }: CategoryGridProps) => (
  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-8">
    {Object.entries(CATEGORY_SHORT).map(([key, label]) => (
      <button
        key={key}
        onClick={() => onCategoryClick(key)}
        className={`flex flex-col items-center justify-center gap-2 py-4 px-2 border-[3px] shadow-[6px_6px_0_0_var(--color-brand-deep)] hover:shadow-[8px_8px_0_0_var(--color-brand-deep)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer ${
          categoryFilter === key
            ? "bg-brand-deep text-white border-brand-deep"
            : "bg-white text-brand-deep border-brand-deep"
        }`}
      >
        <span className={`w-7 h-7 flex items-center justify-center ${categoryFilter === key ? "text-white" : "text-brand-deep"}`}>
          {CATEGORY_ICONS[key]}
        </span>
        <span className="text-[11px] font-semibold text-center leading-tight">
          {label}
        </span>
      </button>
    ))}
  </div>
);

export default CategoryGrid;
