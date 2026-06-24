import { CATEGORY_SHORT } from "../../../shared/constants/product";
import { CATEGORY_ICONS } from "../../../shared/constants/productIcons";

interface CategoryGridProps {
  categoryFilter: string;
  onCategoryClick: (key: string) => void;
}

const CategoryGrid = ({ categoryFilter, onCategoryClick }: CategoryGridProps) => (
  <>
    {/* Mobile: horizontal scroll */}
    <div className="flex sm:hidden gap-3 mb-8 overflow-x-auto pb-2 scrollbar-thin">
      {Object.entries(CATEGORY_SHORT).map(([key, label]) => (
        <button
          key={key}
          onClick={() => onCategoryClick(key)}
          className={`group flex flex-col items-center justify-center gap-2 py-4 px-5 border-[3px] shadow-[4px_4px_0_0_var(--color-brand-deep)] hover:shadow-[6px_6px_0_0_var(--color-brand-deep)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 cursor-pointer shrink-0 w-[100px] ${
            categoryFilter === key
              ? "bg-brand-deep text-white border-brand-deep"
              : "bg-white text-brand-deep border-brand-deep hover:bg-brand-deep hover:text-white"
          }`}
        >
          <span className={`w-7 h-7 flex items-center justify-center ${categoryFilter === key ? "text-white" : "text-brand-deep group-hover:text-white"} transition-colors duration-200`}>
            {CATEGORY_ICONS[key]}
          </span>
          <span className="text-[11px] font-semibold text-center leading-tight">
            {label}
          </span>
        </button>
      ))}
    </div>

    {/* Desktop: grid */}
    <div className="hidden sm:grid grid-cols-5 gap-3 mb-8">
      {Object.entries(CATEGORY_SHORT).map(([key, label]) => (
        <button
          key={key}
          onClick={() => onCategoryClick(key)}
          className={`group flex flex-col items-center justify-center gap-2 py-4 px-2 border-[3px] shadow-[6px_6px_0_0_var(--color-brand-deep)] hover:shadow-[8px_8px_0_0_var(--color-brand-deep)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 cursor-pointer ${
            categoryFilter === key
              ? "bg-brand-deep text-white border-brand-deep"
              : "bg-white text-brand-deep border-brand-deep hover:bg-brand-deep hover:text-white"
          }`}
        >
          <span className={`w-7 h-7 flex items-center justify-center ${categoryFilter === key ? "text-white" : "text-brand-deep group-hover:text-white"} transition-colors duration-200`}>
            {CATEGORY_ICONS[key]}
          </span>
          <span className="text-[11px] font-semibold text-center leading-tight">
            {label}
          </span>
        </button>
      ))}
    </div>
  </>
);

export default CategoryGrid;
