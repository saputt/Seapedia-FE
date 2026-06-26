import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { VTLink as Link } from "../../shared/utils/VTLink";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "../../shared/components/layout/MainLayout";
import AlertModal from "../../shared/components/ui/AlertModal";
import Button from "../../shared/components/ui/Button";
import StarRating from "../../shared/components/ui/StarRating";
import QuantitySelector from "../../features/catalog/components/QuantitySelector";
import ProductReviews from "../../features/catalog/components/ProductReviews";
import ProductCard from "../../features/catalog/components/ProductCard";
import MobileBuyBar from "../../features/catalog/components/MobileBuyBar";
import BuyBottomSheet from "../../features/catalog/components/BuyBottomSheet";
import { useProductDetail } from "../../features/catalog/hooks/useProductDetail";
import { useProductReviews } from "../../features/review/hooks/useReviews";
import { getAllProducts } from "../../features/catalog/api/catalog.api";
import { useAddToCart, useClearAndAddToCart } from "../../features/cart/hooks/useCartMutations";
import useAuthStore from "../../features/auth/store/authStore";
import { CATEGORY_LABEL } from "../../shared/constants/product";
import { prefetchStore } from "@/shared/utils/prefetch";

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { data: product, isLoading, isError } = useProductDetail(productId!);
  const { data: reviewsData } = useProductReviews(productId!);
  const reviews = (reviewsData as any)?.reviews || [];
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();
  
  const storeId = product?.store?.id;

  const { data: storeProductsData } = useQuery({
    queryKey: ["store-products-list", storeId],
    queryFn: () => getAllProducts({ storeId: storeId!, limit: 5 }),
    enabled: !!storeId,
  });
  const storeProducts = ((storeProductsData as any)?.data ?? storeProductsData as any)?.products ?? [];

  const { data: randomProductsData } = useQuery({
    queryKey: ["random-products", productId],
    queryFn: () => getAllProducts({ limit: 10, sortBy: "newest" }),
    enabled: !!productId,
  });
  const allRandom = ((randomProductsData as any)?.data ?? randomProductsData as any)?.products ?? [];
  const randomProducts = allRandom.filter((p: any) => p.id !== productId).slice(0, 10);

  const [quantity, setQuantity] = useState(1);
  const subtotal = product && product.price ? product.price * quantity : 0;

  useEffect(() => {
    if (product) {
      setQuantity(1);
    }
  }, [product]);

  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [showStoreAlert, setShowStoreAlert] = useState(false);
  const [showBuySheet, setShowBuySheet] = useState(false);
  const [addError, setAddError] = useState("");

  const isLoggedIn = !!token;

  const addMutation = useAddToCart();
  const clearAndAddMutation = useClearAndAddToCart();

  const handleAddToCart = () => {
    addMutation.mutate(
      { productId: productId!, quantity },
      {
        onError: (err: Error) => {
          const msg = err?.message || "";
          if (msg.includes("cart must be one store only")) {
            setShowStoreAlert(true);
          } else {
            setAddError(msg || "Gagal menambahkan ke keranjang.");
          }
        },
      }
    );
  };

  const handleClearAndAdd = () => {
    clearAndAddMutation.mutate(
      {
        productId: productId!,
      },
      {
        onSuccess: () => setShowStoreAlert(false),
        onError: () => setAddError("Gagal menambahkan ke keranjang."),
      }
    );
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      setShowLoginAlert(true);
      return;
    }
    
    if (product && product.stock < 1 || quantity < 1) {
      return;
    }
    
    navigate(`/checkout?buyNow=1&productId=${productId}&quantity=${quantity}`);
  };

  const handleMobileBuyNow = () => {
    if (!isLoggedIn) {
      setShowLoginAlert(true);
      return;
    }
    setShowBuySheet(true);
  };

  return (
    <MainLayout>
        <div className="max-w-[1280px] mx-auto w-full px-3 lg:px-8 py-8 pb-24 md:pb-8">
        {!isLoading && !isError && product && (
          <nav className="hidden md:flex items-center gap-1 text-sm text-text-secondary mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-brand-deep transition-colors font-medium">Home</Link>
            <span className="text-text-muted">/</span>
            {product.category && (
              <Link
                to={`/?category=${product.category}`}
                className="hover:text-brand-deep transition-colors font-medium"
              >
                {CATEGORY_LABEL[product.category] || product.category}
              </Link>
            )}
            <span className="text-text-muted">/</span>
            <span className="text-text-primary font-medium truncate max-w-[300px]">{product.name}</span>
          </nav>
        )}

        {isLoading && (
          <>
            <div className="hidden md:block h-6 mb-6" />
            <div className="flex flex-col md:flex-row gap-8 animate-pulse">
              <div className="flex-1">
                <div className="flex flex-col md:flex-row gap-10">
                  <div className="aspect-square bg-bg-tertiary flex items-center justify-center overflow-hidden w-[100vw] relative left-[50%] -translate-x-1/2 -mt-8 md:w-[40%] md:left-0 md:translate-x-0 md:relative md:-mt-0" />
                  <div className="flex-1 space-y-4">
                    <div className="h-8 bg-bg-tertiary rounded w-3/4" />
                    <div className="h-6 bg-bg-tertiary rounded w-1/4" />
                    <div className="h-4 bg-bg-tertiary rounded w-1/3" />
                    <div className="h-20 bg-bg-tertiary rounded" />
                  </div>
                </div>
              </div>
              <div className="hidden md:block w-80">
                <div className="card p-6 space-y-4">
                  <div className="h-6 bg-bg-tertiary rounded w-1/2" />
                  <div className="h-10 bg-bg-tertiary rounded" />
                  <div className="h-5 bg-bg-tertiary rounded w-1/3" />
                  <div className="h-12 bg-bg-tertiary rounded" />
                </div>
              </div>
            </div>
          </>
        )}

        {isError && (
          <div className="text-center py-20">
            <p className="text-danger font-semibold text-lg">
              Produk tidak ditemukan.
            </p>
            <Link
              to="/"
              className="text-brand-deep font-medium hover:underline mt-2 inline-block"
            >
              Lihat produk lainnya
            </Link>
          </div>
        )}

        {!isLoading && !isError && product && (product as any).isHidden && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🙈</div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Produk Disembunyikan</h2>
            <p className="text-text-secondary text-lg mb-6 max-w-md mx-auto leading-relaxed">
              Produk ini telah disembunyikan oleh admin dan tidak dapat diakses oleh pembeli.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-deep text-white font-semibold rounded-lg hover:bg-brand-mid transition-colors border-[3px] border-brand-deep shadow-[4px_4px_0_0_var(--color-brand-deep)]"
            >
              Lihat Produk Lainnya
            </Link>
          </div>
        )}

        {!isLoading && !isError && product && !(product as any).isHidden && (<>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column - Image and Product Info */}
            <div className="flex-1">
                <div className="flex flex-col md:flex-row gap-10">
                <div className="aspect-square bg-bg-tertiary flex items-center justify-center overflow-hidden w-[100vw] relative left-[50%] -translate-x-1/2 -mt-8 md:w-[40%] md:left-0 md:translate-x-0 md:relative md:aspect-square md:-mt-0">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-text-muted">No Image</span>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto">
                  <h1 className="text-[2rem] font-bold text-text-primary">
                    {product.name}
                  </h1>

                  <p className="text-3xl font-extrabold text-brand-deep mt-2">
                    Rp{product.price?.toLocaleString("id-ID")}
                  </p>

                  {(product as any).averageRating > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <StarRating value={Math.round((product as any).averageRating)} readonly />
                      <span className="text-sm text-text-muted">
                        {(product as any).averageRating} ({(product as any).reviewCount} ulasan)
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-text-secondary">Stok:</span>
                    <span
                      className={`font-semibold ${
                        product.stock > 0 ? "text-success" : "text-danger"
                      }`}
                    >
                      {product.stock > 0 ? `${product.stock} tersedia` : "Habis"}
                    </span>
                  </div>

                  {product.category && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-text-secondary">Kategori:</span>
                      <span className="text-xs bg-brand-subtle text-text-primary px-2 py-0.5 rounded font-medium">
                        {CATEGORY_LABEL[product.category] || product.category}
                      </span>
                    </div>
                  )}

                  {product.store && (
                    <Link 
                      to={`/stores/${product.store.id}`} 
                      className="block mt-6"
                      onMouseEnter={() => prefetchStore(product.store.id)}
                      onTouchStart={() => prefetchStore(product.store.id)}
                    >
                      <div className="card p-5 hover:bg-brand-subtle hover:border-brand-deep/30 transition-all duration-200 border-[2px] border-bg-tertiary w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-lg text-text-primary truncate">
                              {(product.store as any).name}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-text-muted">
                              <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                <span className="font-semibold text-text-primary">
                                  {((product.store as any).reviewStats?.averageRating ?? 0) > 0
                                    ? (product.store as any).reviewStats.averageRating.toFixed(1)
                                    : "—"}
                                </span>
                                <span>
                                  ({(product.store as any).reviewStats?.totalReviews ?? 0} ulasan)
                                </span>
                              </span>
                              <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                <span>{(product.store as any)._count?.products ?? product.store.products?.length ?? 0} produk</span>
                              </span>
                            </div>
                          </div>
                          <svg className="w-5 h-5 text-text-muted flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </div>
                      </div>
                    </Link>
                  )}

                  <div className="border-t-[3px] border-bg-tertiary pt-4 mt-4">
                    <h2 className="font-bold text-lg text-text-primary mb-2">
                      Deskripsi
                    </h2>
                    <p className="text-text-secondary leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>
              </div>

              {!isLoading && !isError && product && (
                <ProductReviews reviews={reviews} reviewCount={(product as any).reviewCount || reviews.length} averageRating={(product as any).averageRating} />
              )}
            </div>

            {/* Right Column - Sticky Sidebar */}
            <div className="hidden md:block lg:col-span-1 sticky top-20 self-start max-w-xs">
              <div className="card p-6">
                <h2 className="font-bold text-lg text-text-primary mb-4">
                  Atur Jumlah
                </h2>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-text-secondary">Jumlah:</span>
                    <QuantitySelector
                      quantity={quantity}
                      stock={product.stock}
                      onIncrease={() => setQuantity((prev) => Math.min(product.stock, prev + 1))}
                      onDecrease={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    />
                  </div>
                  <span className={`text-sm font-semibold ${product.stock > 0 ? "text-success" : "text-danger"}`}>
                    {product.stock > 0 ? `${product.stock} tersedia` : "Habis"}
                  </span>
                </div>
                
                <div className="border-t border-bg-tertiary pt-4 mb-4">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Subtotal:</span>
                    <span className="font-bold text-lg text-brand-deep">
                      Rp{subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
                 
                <div className="flex flex-col gap-2">
                  {isLoggedIn ? (
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      loading={addMutation.isPending}
                      disabled={product.stock < 1 || quantity < 1}
                      onClick={handleAddToCart}
                    >
                      {addMutation.isPending ? "Menambahkan..." : `Tambah ke Keranjang (${quantity})`}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setShowLoginAlert(true)}
                      variant="primary"
                      size="lg"
                      fullWidth
                    >
                      Tambah ke Keranjang
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="lg"
                    fullWidth
                    onClick={handleBuyNow}
                    disabled={!isLoggedIn || product.stock < 1 || quantity < 1}
                  >
                    {`Beli Sekarang (${quantity})`}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {storeId && (
            <section className="mt-12">
              <h2 className="text-xl font-bold text-text-primary mb-6">Lainnya di Toko</h2>
              {storeProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {storeProducts.slice(0, 5).map((p: any) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="card animate-pulse p-0">
                    <div className="aspect-square bg-bg-tertiary" />
                    <div className="p-2 space-y-2">
                      <div className="h-4 bg-bg-tertiary rounded w-3/4" />
                      <div className="h-5 bg-bg-tertiary rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
              )}
            </section>
          )}

          {storeId && (
            <section className="mt-12 mb-12">
              <h2 className="text-xl font-bold text-text-primary mb-6">Pilihan Lainnya Untukmu</h2>
              {randomProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {randomProducts.slice(0, 10).map((p: any) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="card animate-pulse p-0">
                    <div className="aspect-square bg-bg-tertiary" />
                    <div className="p-2 space-y-2">
                      <div className="h-4 bg-bg-tertiary rounded w-3/4" />
                      <div className="h-5 bg-bg-tertiary rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
              )}
            </section>
          )}
        </>)}

        <MobileBuyBar
          isLoggedIn={isLoggedIn}
          stock={product?.stock ?? 0}
          quantity={quantity}
          addPending={addMutation.isPending}
          clearPending={clearAndAddMutation.isPending}
          onAddToCart={handleAddToCart}
          onBuyNow={handleMobileBuyNow}
          onLoginClick={() => setShowLoginAlert(true)}
        />

        <BuyBottomSheet
          isOpen={showBuySheet}
          onClose={() => setShowBuySheet(false)}
          product={product ? { name: product.name, price: product.price, imageUrl: product.imageUrl, stock: product.stock } : null}
          quantity={quantity}
          onQuantityChange={setQuantity}
          onBuyNow={handleBuyNow}
          isLoggedIn={isLoggedIn}
          onLoginClick={() => setShowLoginAlert(true)}
        />
      </div>

      <AlertModal
        isOpen={showLoginAlert}
        onClose={() => setShowLoginAlert(false)}
        icon="🔒"
        title="Login Diperlukan"
        message="Silakan masuk atau daftar akun terlebih dahulu untuk dapat menambahkan produk ke keranjang."
        actionLabel="Masuk"
        actionTo="/auth/login"
      />

      <AlertModal
        isOpen={showStoreAlert}
        onClose={() => setShowStoreAlert(false)}
        icon="🛒"
        title="Toko Berbeda"
        message="Keranjang Anda sudah berisi produk dari toko lain. Tambah produk ini akan menghapus keranjang saat ini. Lanjutkan?"
        actionLabel="Hapus & Tambah"
        onAction={handleClearAndAdd}
      />

    </MainLayout>
  );
};

export default ProductDetailPage;
