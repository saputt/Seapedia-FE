import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../shared/components/layout/MainLayout";
import ProductCard from "../../features/catalog/components/ProductCard";
import { useProducts } from "../../features/catalog/hooks/useProducts";
import { useWallet } from "../../features/wallet/hooks/useWallet";
import useProductSearchStore from "../../features/catalog/store/productSearchStore";

const ProductListPage = () => {
  const navigate = useNavigate();
  const { data: wallet } = useWallet();
  const searchQuery = useProductSearchStore((s) => s.query);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProducts(debouncedSearch);

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

  return (
    <MainLayout navbarVariant="products">
      <div className="max-w-[1280px] mx-auto w-full px-6 lg:px-8 py-8">

        {/* Wallet Info */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
