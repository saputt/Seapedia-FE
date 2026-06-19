import { useState } from "react";

const CustomSelect = ({ value, options, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);

  const currentLabel = options.find(([key]) => key === value)?.[1] || placeholder || "Pilih...";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full border-[3px] border-brand-deep px-3 py-2 text-sm bg-white text-left flex items-center justify-between gap-2 hover:bg-brand-subtle transition-colors"
      >
        <span>{currentLabel}</span>
        <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-full card !p-1 z-20 shadow-[4px_4px_0px_0px_var(--color-brand-deep)]">
            {options.map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => { onChange(key); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                  value === key
                    ? "bg-brand-deep text-white font-semibold"
                    : "text-text-secondary hover:bg-brand-subtle"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomSelect;
