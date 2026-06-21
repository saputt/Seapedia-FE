import { CATEGORY_LABEL } from "../../../shared/constants/product";
import { CATEGORY_ICONS, SORT_OPTIONS } from "../../../shared/constants/productIcons";

interface ProductFilterSidebarProps {
  categoryFilter: string;
  sortByParam: string;
  filterMinPrice: string;
  filterMaxPrice: string;
  onCategoryClick: (key: string) => void;
  onApplyPriceFilter: () => void;
  onSortChange: (value: string) => void;
  onClearAll: () => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
}

const ProductFilterSidebar = ({
  categoryFilter,
  sortByParam,
  filterMinPrice,
  filterMaxPrice,
  onCategoryClick,
  onApplyPriceFilter,
  onSortChange,
  onClearAll,
  onMinPriceChange,
  onMaxPriceChange,
}: ProductFilterSidebarProps) => (
  <div className="card !p-4">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-bold text-text-primary">Filter</h3>
      <button onClick={onClearAll} className="text-xs text-brand-deep font-semibold hover:underline">
        Hapus
      </button>
    </div>

    <div className="mb-4">
      <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Kategori</h4>
      <div className="space-y-1">
        {Object.entries(CATEGORY_LABEL).map(([key, label]) => (
          <button
            key={key}
            onClick={() => onCategoryClick(key)}
            className={`block w-full text-left text-sm px-2 py-1 rounded transition-colors ${
              categoryFilter === key
                ? "bg-brand-deep text-white font-semibold"
                : "text-text-secondary hover:bg-brand-subtle"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>

    <div className="mb-4">
      <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Harga</h4>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={filterMinPrice}
          onChange={(e) => onMinPriceChange(e.target.value)}
          className="input-neo w-full text-sm !py-1.5"
          placeholder="Min"
          min="0"
        />
        <span className="text-text-muted text-xs">-</span>
        <input
          type="number"
          value={filterMaxPrice}
          onChange={(e) => onMaxPriceChange(e.target.value)}
          className="input-neo w-full text-sm !py-1.5"
          placeholder="Max"
          min="0"
        />
      </div>
      <button onClick={onApplyPriceFilter} className="mt-2 text-xs font-semibold text-brand-deep hover:underline">
        Terapkan
      </button>
    </div>

    <div>
      <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Urutkan</h4>
      <select
        value={sortByParam}
        onChange={(e) => onSortChange(e.target.value)}
        className="input-neo w-full text-sm !py-1.5"
      >
        {SORT_OPTIONS.map((opt: { value: string; label: string }) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  </div>
);

export default ProductFilterSidebar;
