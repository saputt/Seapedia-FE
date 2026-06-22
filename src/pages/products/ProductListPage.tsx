import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "../../shared/components/layout/MainLayout";
import ProductCard from "../../features/catalog/components/ProductCard";
import ProductFilterSidebar from "../../features/catalog/components/ProductFilterSidebar";
import CategoryGrid from "../../features/catalog/components/CategoryGrid";
import { useProducts } from "../../features/catalog/hooks/useProducts";
import { useTopSellingProducts } from "../../features/catalog/hooks/useTopSellingProducts";
import useAuthStore from "../../features/auth/store/authStore";
import { useWallet } from "../../features/wallet/hooks/useWallet";
import type { ProductCategory } from "../../types";
import PromoBannerCarousel from "../../features/catalog/components/PromoBannerCarousel";
import { PROMO_BANNERS } from "../../shared/constants/promoBanners";
import useDebounce from "../../shared/hooks/useDebounce";
import useInfiniteScroll from "../../shared/hooks/useInfiniteScroll";

const ProductListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const token = useAuthStore((s) => s.token);
  const { data: wallet } = useWallet();
  const rawQuery = searchParams.get("q") || "";
  const debouncedSearch = useDebounce(rawQuery, 400);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categoryFilter = searchParams.get("category") || "";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";
  const sortByParam = searchParams.get("sortBy") || "newest";

  const [showFilters, setShowFilters] = useState(false);
  const [filterMinPrice, setFilterMinPrice] = useState(minPriceParam);
  const [filterMaxPrice, setFilterMaxPrice] = useState(maxPriceParam);

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

  const loadMoreRef = useInfiniteScroll(
    () => {
      if (hasNextPage && !isFetchingNextPage && canLoadMore) {
        fetchNextPage();
      }
    },
    { enabled: canLoadMore && hasNextPage && !isFetchingNextPage }
  );

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
            {showLoginPrompt &&
              Array.from({ length: 5 - (allProducts.length % 5 === 0 ? 5 : allProducts.length % 5) }).map((_, i) => (
                <div key={`filler-${i}`} className="card animate-pulse opacity-50">
                  <div className="aspect-square bg-bg-tertiary mb-4" />
                  <div className="h-5 bg-bg-tertiary rounded w-3/4 mb-2" />
                  <div className="h-6 bg-bg-tertiary rounded w-1/3 mb-2" />
                  <div className="h-4 bg-bg-tertiary rounded w-1/2" />
                </div>
              ))}
          </div>

          <div ref={loadMoreRef} className="mt-8">
            {isFetchingNextPage && (
              <div className="flex justify-center">
                <div className="flex items-center gap-2 text-text-secondary">
                  <span className="w-5 h-5 border-[3px] border-brand-deep border-t-transparent rounded-full animate-spin" />
                  Memuat produk lainnya...
                </div>
              </div>
            )}
            {showLoginPrompt && !isFetchingNextPage && (
              <div className="relative">
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 opacity-50 pointer-events-none select-none">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="card animate-pulse">
                      <div className="aspect-square bg-bg-tertiary mb-4" />
                      <div className="h-5 bg-bg-tertiary rounded w-3/4 mb-2" />
                      <div className="h-6 bg-bg-tertiary rounded w-1/3 mb-2" />
                      <div className="h-4 bg-bg-tertiary rounded w-1/2" />
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="card text-center py-6 px-4 border-border-primary max-w-md w-full mx-4">
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
              </div>
            )}
            {!hasNextPage && allProducts.length > 0 && !showLoginPrompt && (
              <div className="flex justify-center">
                <p className="text-text-muted text-sm">Semua produk telah ditampilkan</p>
              </div>
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
          <CategoryGrid categoryFilter={categoryFilter} onCategoryClick={handleCategoryClick} />
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
            <aside className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-56 shrink-0 space-y-6 sticky top-[88px] self-start`}>
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
