import React, { useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import Spinner from "../../shared/components/ui/Spinner";
import useAuthStore from "../../../features/auth/store/authStore";

interface ProductGridProps {
  allProducts: any[];
  isLoading: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  debouncedSearch: string;
  canLoadMore: boolean;
  showLoginPrompt: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  allProducts,
  isLoading,
  isError,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  debouncedSearch,
  canLoadMore,
  showLoginPrompt,
}) => {
  const navigate = useNavigate();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <>
      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-3 lg:gap-y-6 lg:gap-gap-5">
          {Array.from({ length: 10 }).map((_, i) => (
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
              <div className="flex justify-center">
                <Spinner size="sm" />
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
};