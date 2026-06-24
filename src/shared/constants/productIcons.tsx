import React from "react";
import type { ProductCategory } from "../../types";

export const CATEGORY_ICONS: Record<ProductCategory, React.ReactNode> & { [key: string]: React.ReactNode } = {
  ELECTRONICS: (
    <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
      <rect x="6" y="5" width="28" height="22" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <line x1="14" y1="31" x2="26" y2="31" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="20" y1="27" x2="20" y2="31" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  ),
  FASHION: (
    <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
      <path d="M10 8L6 16L12 20L20 12L28 20L34 16L30 8H26L22 14H18L14 8H10Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
      <line x1="20" y1="12" x2="20" y2="30" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  ),
  HOME: (
    <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
      <path d="M6 18L20 6L34 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="14" y="20" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="2.5" fill="none" />
    </svg>
  ),
  FOOD: (
    <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
      <path d="M12 6V18C12 22.5 16 26 20 26C24 26 28 22.5 28 18V6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <line x1="8" y1="32" x2="32" y2="32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  HOBBY: (
    <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
      <circle cx="14" cy="20" r="8" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="26" cy="20" r="8" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <line x1="20" y1="8" x2="20" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="10" y1="28" x2="14" y2="30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="30" y1="28" x2="26" y2="30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
};

export const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "newest", label: "Terbaru" },
  { value: "oldest", label: "Terlama" },
  { value: "price_asc", label: "Harga Termurah" },
  { value: "price_desc", label: "Harga Termahal" },
];
