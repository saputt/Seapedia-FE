import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../../shared/components/layout/MainLayout";
import ProductCard from "../../features/catalog/components/ProductCard";
import StoreReviews from "../../features/store/components/StoreReviews";
import StarRating from "../../shared/components/ui/StarRating";
import Spinner from "../../shared/components/ui/Spinner";
import { useStore } from "../../features/store/hooks/useStore";
import { useStoreProducts } from "../../features/store/hooks/useStoreProducts";
import { useStoreReviews } from "../../features/store/hooks/useStoreReviews";
import useDebounce from "../../shared/hooks/useDebounce";
import useInfiniteScroll from "../../shared/hooks/useInfiniteScroll";

type Tab = "products" | "reviews";

const StoreDetailPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const { data: store, isLoading: storeLoading, isError: storeError } = useStore(storeId!);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const debouncedSearch = useDebounce(search);

  const {
    data,
    isLoading: productsLoading,
    isError: productsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useStoreProducts(storeId!, debouncedSearch);

  const {
    data: reviewsData,
    isLoading: reviewsLoading,
  } = useStoreReviews(storeId!);

  const allProducts = data?.pages.flatMap((page: any) => page.products ?? page.data ?? []) ?? [];
  const totalProducts = (data as any)?.pages[0]?.total ?? 0;

  const loadMoreRef = useInfiniteScroll(fetchNextPage, {
    enabled: hasNextPage && !isFetchingNextPage,
  });

  if (storeLoading) {
    return (
      <MainLayout>
        <div className="max-w-[1280px] mx-auto w-full px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-6 w-32 bg-bg-tertiary rounded" />
            <div className="card space-y-3">
              <div className="h-8 bg-bg-tertiary rounded w-1/2" />
              <div className="h-4 bg-bg-tertiary rounded w-3/4" />
              <div className="h-4 bg-bg-tertiary rounded w-1/4" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-square bg-bg-tertiary mb-4" />
                  <div className="h-5 bg-bg-tertiary rounded w-3/4 mb-2" />
                  <div className="h-6 bg-bg-tertiary rounded w-1/3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (storeError || !store) {
    return (
      <MainLayout>
        <div className="max-w-[1280px] mx-auto w-full px-6 lg:px-8 py-8 text-center">
          <p className="text-danger font-semibold text-lg">Toko tidak ditemukan.</p>
          <Link to="/" className="text-brand-deep font-medium hover:underline mt-2 inline-block">
            Lihat produk lainnya
          </Link>
        </div>
      </MainLayout>
    );
  }

  const reviewsStats = reviewsData?.stats;
  const reviews = reviewsData?.reviews ?? [];

  return (
    <MainLayout>
      <div className="max-w-[1280px] mx-auto w-full px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center gap-1 text-text-secondary hover:text-brand-deep transition-colors mb-6 font-medium">
          &larr; Ke produk
        </Link>

        <div className="card mb-8">
          <h1 className="text-[1.75rem] font-bold text-text-primary">{(store as any).storeName}</h1>
          <p className="text-text-secondary mt-2 leading-relaxed">{(store as any).description}</p>
          <div className="flex items-center gap-4 mt-3">
            <p className="text-sm font-semibold text-text-muted">
              {totalProducts} Produk
            </p>
            {reviewsStats && reviewsStats.reviewCount > 0 && (
              <div className="flex items-center gap-1 text-sm text-text-muted">
                <StarRating rating={Math.round(reviewsStats.averageRating)} size="sm" />
                <span className="font-semibold">{reviewsStats.averageRating.toFixed(1)}</span>
                <span>({reviewsStats.reviewCount})</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-6 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "products"
                ? "text-brand-deep border-brand-deep"
                : "text-text-muted border-transparent hover:text-text-secondary"
            }`}
          >
            Produk
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "reviews"
                ? "text-brand-deep border-brand-deep"
                : "text-text-muted border-transparent hover:text-text-secondary"
            }`}
          >
            Ulasan
            {reviewsStats && reviewsStats.reviewCount > 0 && (
              <span className="ml-1 text-xs">({reviewsStats.reviewCount})</span>
            )}
          </button>
        </div>

        {activeTab === "products" ? (
          <>
            <div className="mb-8">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-neo w-full max-w-xl"
                placeholder="Cari produk di toko ini..."
              />
            </div>

            {productsLoading && (
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

            {productsError && (
              <div className="text-center py-20">
                <p className="text-danger font-semibold text-lg">Gagal memuat produk. Silakan coba lagi.</p>
              </div>
            )}

            {!productsLoading && !productsError && allProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-text-secondary text-lg">
                  {debouncedSearch
                    ? `Tidak ditemukan produk untuk "${debouncedSearch}"`
                    : "Belum ada produk dari toko ini."}
                </p>
              </div>
            )}

            {!productsLoading && !productsError && allProducts.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {allProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                <div ref={loadMoreRef} className="mt-8 flex justify-center">
                  {isFetchingNextPage && (
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Spinner size="sm" />
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
        ) : (
          <StoreReviews
            reviews={reviews}
            total={reviewsData?.total ?? 0}
            averageRating={reviewsStats?.averageRating ?? 0}
            isLoading={reviewsLoading}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default StoreDetailPage;
