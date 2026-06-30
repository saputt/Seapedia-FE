import React from "react";
import { VTLink as Link } from "../../../shared/utils/VTLink";
import PromoBannerCarousel from "./PromoBannerCarousel";
import { CATEGORY_SHORT } from "../../../shared/constants/product";
import { CATEGORY_ICONS } from "../../../shared/constants/productIcons";
import { PROMO_BANNERS } from "../../../shared/constants/promoBanners";
import type { ProductCategory } from "../../../types";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../features/auth/store/authStore";
import { useWallet } from "../../../features/wallet/hooks/useWallet";
import ProductCard from "./ProductCard";

interface ProductListHeroProps {
  categoryFilter: string;
  handleCategoryClick: (key: string) => void;
  topSellingProducts: any[];
}

export const ProductListHero: React.FC<ProductListHeroProps> = ({
  categoryFilter,
  handleCategoryClick,
  topSellingProducts,
}) => {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const { data: wallet } = useWallet();

  return (
    <>
      <div className="mb-6">
        <PromoBannerCarousel banners={PROMO_BANNERS} />
      </div>

      {token && (
        <Link
          to="/wallet"
          className="card w-full flex items-center justify-between mb-6 hover:bg-brand-subtle transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-deep">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            <span className="text-sm font-medium text-text-primary">Saldo Dompet</span>
          </div>
          <span className="text-sm font-bold text-brand-deep">
            Rp{wallet?.balance?.toLocaleString("id-ID") ?? 0}
          </span>
        </Link>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-8">
        {Object.entries(CATEGORY_SHORT).map(([key, label]) => (
          <button
            key={key}
            onClick={() => handleCategoryClick(key)}
            className={`flex flex-col items-center justify-center gap-2 py-4 px-2 border-[3px] shadow-[6px_6px_0_0_var(--color-brand-deep)] hover:shadow-[8px_8px_0_0_var(--color-brand-deep)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer ${
              categoryFilter === key
                ? "bg-brand-deep text-white border-brand-deep"
                : "bg-white text-brand-deep border-brand-deep"
            }`}
          >
            <span className={`w-7 h-7 flex items-center justify-center ${categoryFilter === key ? "text-white" : "text-brand-deep"}`}>
              {CATEGORY_ICONS[key as ProductCategory]}
            </span>
            <span className="text-[11px] font-semibold text-center leading-tight">
              {label}
            </span>
          </button>
        ))}
      </div>

      {topSellingProducts.length > 0 && (
        <div className="mb-8">
          <div className="bg-brand-deep border-[3px] border-brand-deep shadow-[6px_6px_0_0_var(--color-brand-deep)] p-6 flex gap-6">
            <div className="hidden sm:flex flex-col justify-center shrink-0 pr-6 border-r-[3px] border-white/30">
              <h2 className="text-white text-2xl font-bold leading-tight">Produk<br/>Terlaris</h2>
              <p className="text-white/70 text-sm mt-2">Pilihan favorit pembeli</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1 min-w-0">
              {topSellingProducts.slice(0, 4).map((product: any) => (
                <div key={product.id} className="bg-white border-[3px] border-brand-deep">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};