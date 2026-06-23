import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import MainLayout from "../../shared/components/layout/MainLayout";
import AlertModal from "../../shared/components/ui/AlertModal";
import Button from "../../shared/components/ui/Button";
import StarRating from "../../shared/components/ui/StarRating";
import QuantitySelector from "../../features/catalog/components/QuantitySelector";
import ProductReviews from "../../features/catalog/components/ProductReviews";
import MobileBuyBar from "../../features/catalog/components/MobileBuyBar";
import { useProductDetail } from "../../features/catalog/hooks/useProductDetail";
import { useProductReviews } from "../../features/review/hooks/useReviews";
import { useAddToCart, useClearAndAddToCart } from "../../features/cart/hooks/useCartMutations";
import useAuthStore from "../../features/auth/store/authStore";
import { CATEGORY_LABEL } from "../../shared/constants/product";

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { data: product, isLoading, isError } = useProductDetail(productId!);
  const { data: reviewsData } = useProductReviews(productId!);
  const reviews = (reviewsData as any)?.reviews || [];
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();
  
  const [quantity, setQuantity] = useState(1);
  const subtotal = product && product.price ? product.price * quantity : 0;

  useEffect(() => {
    if (product) {
      setQuantity(1);
    }
  }, [product]);

  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [showStoreAlert, setShowStoreAlert] = useState(false);
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

  return (
    <MainLayout>
      <div className="max-w-[1280px] mx-auto w-full px-6 lg:px-8 py-8 pb-24 md:pb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-text-secondary hover:text-brand-deep transition-colors mb-6 font-medium"
        >
          &larr; Kembali ke produk
        </Link>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
            <div className="aspect-square bg-bg-tertiary" />
            <div className="space-y-4">
              <div className="h-8 bg-bg-tertiary rounded w-3/4" />
              <div className="h-6 bg-bg-tertiary rounded w-1/4" />
              <div className="h-4 bg-bg-tertiary rounded w-1/3" />
              <div className="h-20 bg-bg-tertiary rounded" />
            </div>
          </div>
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

        {!isLoading && !isError && product && !(product as any).isHidden && (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column - Image and Product Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row gap-10">
                <div className="aspect-square bg-bg-tertiary flex items-center justify-center overflow-hidden w-full md:w-[55%]">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-text-muted">No Image</span>
                  )}
                </div>

                <div className="mt-6">
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

                  {product.store && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-text-secondary">Toko:</span>
                      <Link
                        to={`/stores/${product.store.id}`}
                        className="text-brand-deep font-semibold hover:underline"
                      >
                        {(product.store as any).storeName}
                      </Link>
                    </div>
                  )}

                  {product.category && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-text-secondary">Kategori:</span>
                      <span className="text-xs bg-brand-subtle text-text-primary px-2 py-0.5 rounded font-medium">
                        {CATEGORY_LABEL[product.category] || product.category}
                      </span>
                    </div>
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
                <ProductReviews reviews={reviews} reviewCount={(product as any).reviewCount || reviews.length} />
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
        )}

        <MobileBuyBar
          isLoggedIn={isLoggedIn}
          stock={product?.stock ?? 0}
          quantity={quantity}
          addPending={addMutation.isPending}
          clearPending={clearAndAddMutation.isPending}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
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
