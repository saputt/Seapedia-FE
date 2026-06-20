import { useEffect, useRef, useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "../../shared/components/layout/MainLayout";
import ProductCard from "../../features/catalog/components/ProductCard";
import ProductFilterSidebar from "../../features/catalog/components/ProductFilterSidebar";
import { useProducts } from "../../features/catalog/hooks/useProducts";
import { useWallet } from "../../features/wallet/hooks/useWallet";
import { CATEGORY_LABEL } from "../../shared/constants/product";
import { CATEGORY_ICONS } from "../../shared/constants/productIcons";

const ProductListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: wallet } = useWallet();
  const rawQuery = searchParams.get("q") || "";
  const [debouncedSearch, setDebouncedSearch] = useState(rawQuery);
  const categoryFilter = searchParams.get("category") || "";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";
  const sortByParam = searchParams.get("sortBy") || "newest";
  const loadMoreRef = useRef(null);

  const [showFilters, setShowFilters] = useState(false);
  const [filterMinPrice, setFilterMinPrice] = useState(minPriceParam);
  const [filterMaxPrice, setFilterMaxPrice] = useState(maxPriceParam);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(rawQuery), 400);
    return () => clearTimeout(timer);
  }, [rawQuery]);

  const showHero = !debouncedSearch;

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProducts({
    search: debouncedSearch,
    category: categoryFilter,
    minPrice: minPriceParam || undefined,
    maxPrice: maxPriceParam || undefined,
    sortBy: sortByParam,
  });

  const allProducts = data?.pages.flatMap((page) => page.products) ?? [];

  const handleObserver = useCallback(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
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

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val) next.set(key, val);
      else next.delete(key);
    });
    setSearchParams(next);
  };

  const handleCategoryClick = (key) => {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            {!hasNextPage && allProducts.length > 0 && (
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
          <div className="grid grid-cols-5 gap-3 mb-8">
            {Object.entries(CATEGORY_LABEL).map(([key, label]) => (
              <button
                key={key}
                onClick={() => handleCategoryClick(key)}
                className="flex flex-col items-center justify-center gap-2 py-5 px-2 bg-brand-deep text-white border-[3px] border-brand-deep shadow-[6px_6px_0_0_var(--color-brand-deep)] hover:shadow-[8px_8px_0_0_var(--color-brand-deep)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer"
              >
                <span className="w-8 h-8 flex items-center justify-center text-white">
                  {CATEGORY_ICONS[key]}
                </span>
                <span className="text-[11px] font-semibold text-white text-center leading-tight">
                  {label}
                </span>
              </button>
            ))}
          </div>
        )}

        {debouncedSearch ? (
          <div className="flex gap-8">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-1 text-sm font-semibold text-brand-deep"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/></svg>
              Filter
            </button>

            <aside className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-56 shrink-0 space-y-6`}>
              <ProductFilterSidebar
                categoryFilter={categoryFilter}
                sortByParam={sortByParam}
                filterMinPrice={filterMinPrice}
                filterMaxPrice={filterMaxPrice}
                onCategoryClick={handleCategoryClick}
                onApplyPriceFilter={handleApplyPriceFilter}
                onSortChange={(val) => updateParams({ sortBy: val, page: "" })}
                onClearAll={handleClearAll}
                onMinPriceChange={setFilterMinPrice}
                onMaxPriceChange={setFilterMaxPrice}
              />
            </aside>

            <div className="flex-1 min-w-0">
              {renderProductGrid()}
            </div>
          </div>
        ) : (
          renderProductGrid()
        )}
      </div>
    </MainLayout>
  );
};

export default ProductListPage;
