import { useEffect, useRef, useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "../../shared/components/layout/MainLayout";
import ProductCard from "../../features/catalog/components/ProductCard";
import { useProducts } from "../../features/catalog/hooks/useProducts";
import { useWallet } from "../../features/wallet/hooks/useWallet";
import { CATEGORY_LABEL } from "../../shared/constants/product";

const CATEGORY_ICONS = {
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

const ProductListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: wallet } = useWallet();
  const rawQuery = searchParams.get("q") || "";
  const [debouncedSearch, setDebouncedSearch] = useState(rawQuery);
  const categoryFilter = searchParams.get("category") || "";
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(rawQuery), 400);
    return () => clearTimeout(timer);
  }, [rawQuery]);

  const showHero = !debouncedSearch && !categoryFilter;

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProducts(debouncedSearch, categoryFilter);

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

  const handleCategoryClick = (key) => {
    if (key === categoryFilter) {
      setSearchParams({});
    } else {
      setSearchParams({ category: key });
    }
  };

  return (
    <MainLayout navbarVariant="products">
      <div className="max-w-[1280px] mx-auto w-full px-6 lg:px-8 py-8">

        {/* Wallet Info — only when not searching and not filtering by category */}
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

        {/* Category Cards — only on initial page */}
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

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-square bg-bg-tertiary mb-4" />
                <div className="h-5 bg-bg-tertiary rounded w-3/4 mb-2" />
                <div className="h-6 bg-bg-tertiary rounded w-1/3 mb-2" />
                <div className="h-4 bg-bg-tertiary rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-20">
            <p className="text-danger font-semibold text-lg">
              Gagal memuat produk. Silakan coba lagi.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && allProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-secondary text-lg">
              {debouncedSearch
                ? `Tidak ditemukan produk untuk "${debouncedSearch}"`
                : "Belum ada produk tersedia."}
            </p>
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && !isError && allProducts.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {allProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Load More Trigger */}
            <div ref={loadMoreRef} className="mt-8 flex justify-center">
              {isFetchingNextPage && (
                <div className="flex items-center gap-2 text-text-secondary">
                  <span className="w-5 h-5 border-[3px] border-brand-deep border-t-transparent rounded-full animate-spin" />
                  Memuat produk lainnya...
                </div>
              )}
              {!hasNextPage && allProducts.length > 0 && (
                <p className="text-text-muted text-sm">
                  Semua produk telah ditampilkan
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductListPage;
