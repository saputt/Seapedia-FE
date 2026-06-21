import { useState } from "react";
import { CATEGORY_LABEL } from "../../constants/product";
import type { ProductCategory } from "../../../types";

export type CategoryPickerProps = {
  value: ProductCategory;
  onChange: (value: ProductCategory) => void;
};

const CategoryPicker = ({ value, onChange }: CategoryPickerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="input-neo w-full text-left flex items-center justify-between"
      >
        <span>{CATEGORY_LABEL[value] || value}</span>
        <span className="text-text-muted text-xs">&#9660;</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="card max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-text-primary mb-4">Pilih Kategori</h3>
            <div className="space-y-2">
              {(Object.entries(CATEGORY_LABEL) as [ProductCategory, string][]).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => { onChange(key); setOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded font-medium text-sm transition-colors ${
                    value === key
                      ? "bg-brand-deep text-white"
                      : "bg-bg-secondary text-text-primary hover:bg-brand-subtle"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="mt-4 text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryPicker;
