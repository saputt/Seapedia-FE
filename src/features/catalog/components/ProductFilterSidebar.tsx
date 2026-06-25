import { CATEGORY_LABEL } from "../../../shared/constants/product";
import { handleNumberInput, handleNumberKeyDown } from "@/shared/utils/numberInput";

interface ProductFilterSidebarProps {
  categoryFilter: string;
  filterMinPrice: string;
  filterMaxPrice: string;
  onCategoryClick: (key: string) => void;
  onApplyPriceFilter: () => void;
  onClearAll: () => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onClose?: () => void;
}

const ProductFilterSidebar = ({
  categoryFilter,
  filterMinPrice,
  filterMaxPrice,
  onCategoryClick,
  onApplyPriceFilter,
  onClearAll,
  onMinPriceChange,
  onMaxPriceChange,
  onClose,
}: ProductFilterSidebarProps) => (
  <div className="card !p-4">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-bg-tertiary rounded-lg transition-colors lg:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-primary">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
        <h3 className="text-sm font-bold text-text-primary">Filter</h3>
      </div>
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
          type="text"
          inputMode="numeric"
          value={filterMinPrice}
          onChange={(e) => handleNumberInput(e, onMinPriceChange)}
          onKeyDown={handleNumberKeyDown}
          className="input-neo w-full text-sm !py-1.5"
          placeholder="Min"
        />
        <span className="text-text-muted text-xs">-</span>
        <input
          type="text"
          inputMode="numeric"
          value={filterMaxPrice}
          onChange={(e) => handleNumberInput(e, onMaxPriceChange)}
          onKeyDown={handleNumberKeyDown}
          className="input-neo w-full text-sm !py-1.5"
          placeholder="Max"
        />
      </div>
      <button onClick={onApplyPriceFilter} className="mt-2 text-xs font-semibold text-brand-deep hover:underline">
        Terapkan
      </button>
    </div>
  </div>
);

export default ProductFilterSidebar;
