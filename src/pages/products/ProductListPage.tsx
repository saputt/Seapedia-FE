import React, { useEffect, useRef, useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "../../shared/components/layout/MainLayout";
import PromoBannerCarousel from "../../shared/components/ui/PromoBannerCarousel";
import ProductCard from "../../features/catalog/components/ProductCard";
import ProductFilterSidebar from "../../features/catalog/components/ProductFilterSidebar";
import { useProducts } from "../../features/catalog/hooks/useProducts";
import { useTopSellingProducts } from "../../features/catalog/hooks/useTopSellingProducts";
import useAuthStore from "../../features/auth/store/authStore";
import { useWallet } from "../../features/wallet/hooks/useWallet";
import { CATEGORY_SHORT } from "../../shared/constants/product";
import { CATEGORY_ICONS } from "../../shared/constants/productIcons";
import type { ProductCategory } from "../../types";

const PROMO_BANNERS = [
  {
    id: "1",
    title: "Flash Sale Hari Ini!",
    subtitle: "Diskon hingga 50% untuk produk pilihan",
    gradient: "bg-gradient-to-r from-brand-subtle to-white",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: "2",
    title: "Gratis Ongkir Sepanjang Juni",
    subtitle: "Berlaku untuk semua produk dengan min. transaksi Rp50.000",
    gradient: "bg-gradient-to-r from-green-50 to-emerald-50",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    id: "3",
    title: "Baru Datang: Koleksi Elektronik",
    subtitle: "Gadget terbaru dengan harga spesial",
    gradient: "bg-gradient-to-r from-blue-50 to-indigo-50",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
];

const ProductListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const token = useAuthStore((s) => s.token);
  const { data: wallet } = useWallet();
  const rawQuery = searchParams.get("q") || "";
  const [debouncedSearch, setDebouncedSearch] = useState(rawQuery);
  const categoryFilter = searchParams.get("category") || "";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";
  const sortByParam = searchParams.get("sortBy") || "newest";
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const [showFilters, setShowFilters] = useState(false);
  const [filterMinPrice, setFilterMinPrice] = useState(minPriceParam);
  const [filterMaxPrice, setFilterMaxPrice] = useState(maxPriceParam);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(rawQuery), 400);
    return () => clearTimeout(timer);
  }, [rawQuery]);

  const showHero = !debouncedSearch && !categoryFilter && !minPriceParam && !maxPriceParam;
  const hasActiveFilter = !!debouncedSearch || !!categoryFilter || !!minPriceParam || !!maxPriceParam;

  const isLoggedIn = !!token;

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProducts({
    search: debouncedSearch,
    category: categoryFilter as ProductCategory,
    minPrice: minPriceParam || undefined as any,
    maxPrice: maxPriceParam || undefined as any,
    sortBy: sortByParam,
  });

  const allProducts = data?.pages.flatMap((page: any) => page.products ?? page.data ?? []) ?? [];

  const canLoadMore = isLoggedIn;
  const showLoginPrompt = !isLoggedIn && hasNextPage && allProducts.length > 0;

  const { data: topSellingProducts = [] } = useTopSellingProducts(4);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage && canLoadMore) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage, canLoadMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "100px",
    });
    const el = loadMoreRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [handleObserver]);

  const updateParams = (updates: Record<string, string>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val) next.set(key, val);
      else next.delete(key);
    });
    setSearchParams(next);
  };

  const handleCategoryClick = (key: string) => {
    if (key === categoryFilter) {
      updateParams({ category: "" });
    } else {
      updateParams({ category: key });
    }
  };

  const handleApplyPriceFilter = () => {
    updateParams({ minPrice: filterMinPrice, maxPrice: filterMaxPrice, page: "" });
  };

  const handleClearAll = () => {
    setSearchParams({});
    setFilterMinPrice("");
    setFilterMaxPrice("");
  };

  const renderProductGrid = () => (
    <>
      {isLoading && (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-square bg-bg-tertiary mb-4" />
              <div className="h-5 bg-bg-tertiary rounded w-3/4 mb-2" />
              <div className="h-6 bg-bg-tertiary rounded w-1/3 mb-2" />
              <div className="h-4 bg-bg-tertiary rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-20">
          <p className="text-danger font-semibold text-lg">Gagal memuat produk. Silakan coba lagi.</p>
        </div>
      )}

      {!isLoading && !isError && allProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-text-secondary text-lg">
            {debouncedSearch
              ? `Tidak ditemukan produk untuk "${debouncedSearch}"`
              : "Belum ada produk tersedia."}
          </p>
        </div>
      )}

      {!isLoading && !isError && allProducts.length > 0 && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {allProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div ref={loadMoreRef} className="mt-8 flex justify-center">
            {isFetchingNextPage && (
              <div className="flex items-center gap-2 text-text-secondary">
                <span className="w-5 h-5 border-[3px] border-brand-deep border-t-transparent rounded-full animate-spin" />
                Memuat produk lainnya...
              </div>
            )}
            {showLoginPrompt && !isFetchingNextPage && (
              <div className="w-full max-w-md px-4">
                <div className="card text-center py-6 px-4 border-border-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-brand-deep mb-3">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <p className="text-text-primary font-medium mb-1">Silakan login terlebih dahulu</p>
                  <p className="text-text-secondary text-sm mb-4">Untuk memuat lebih banyak produk, Anda harus login terlebih dahulu.</p>
                  <button
                    onClick={() => navigate("/auth/login")}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-deep text-white font-semibold rounded-lg hover:bg-brand-subtle hover:text-brand-deep transition-colors border-[3px] border-brand-deep shadow-[4px_4px_0_0_var(--color-brand-deep)] hover:shadow-[6px_6px_0_0_var(--color-brand-deep)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    Login Sekarang
                  </button>
                </div>
              </div>
            )}
            {!hasNextPage && allProducts.length > 0 && !showLoginPrompt && (
              <p className="text-text-muted text-sm">Semua produk telah ditampilkan</p>
            )}
          </div>
        </>
      )}
    </>
  );

  return (
    <MainLayout navbarVariant="products">
      <div className="max-w-[1280px] mx-auto w-full px-6 lg:px-8 py-8">

        {showHero && (
          <div className="mb-6">
            <PromoBannerCarousel banners={PROMO_BANNERS} />
          </div>
        )}

        {showHero && !!token && (
          <button
            onClick={() => navigate("/dashboard/buyer/wallet")}
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
          </button>
        )}

        {showHero && (
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
                  {CATEGORY_ICONS[key]}
                </span>
                <span className="text-[11px] font-semibold text-center leading-tight">
                  {label}
                </span>
              </button>
            ))}
          </div>
        )}

        {showHero && topSellingProducts.length > 0 && (
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

        {hasActiveFilter && (
          <div className="flex gap-8">
            <aside className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-56 shrink-0 space-y-6`}>
              <ProductFilterSidebar
                categoryFilter={categoryFilter}
                sortByParam={sortByParam}
                filterMinPrice={filterMinPrice}
                filterMaxPrice={filterMaxPrice}
                onCategoryClick={handleCategoryClick}
                onApplyPriceFilter={handleApplyPriceFilter}
                onSortChange={(val: string) => updateParams({ sortBy: val, page: "" })}
                onClearAll={handleClearAll}
                onMinPriceChange={setFilterMinPrice}
                onMaxPriceChange={setFilterMaxPrice}
              />
            </aside>

            <div className="flex-1 min-w-0">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-1 text-sm font-semibold text-brand-deep mb-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/></svg>
                {showFilters ? "Sembunyikan Filter" : "Tampilkan Filter"}
              </button>
              {renderProductGrid()}
            </div>
          </div>
        )}

        {!hasActiveFilter && renderProductGrid()}
      </div>
    </MainLayout>
  );
};

export default ProductListPage;
