import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../../shared/components/layout/MainLayout";
import AlertModal from "../../shared/components/ui/AlertModal";
import Button from "../../shared/components/ui/Button";
import StarRating from "../../shared/components/ui/StarRating";
import { useProductDetail } from "../../features/catalog/hooks/useProductDetail";
import { useProductReviews } from "../../features/review/hooks/useReviews";
import { useAddToCart, useClearAndAddToCart } from "../../features/cart/hooks/useCartMutations";
import useAuthStore from "../../features/auth/store/authStore";
import { CATEGORY_LABEL } from "../../shared/constants/product";

const ProductDetailPage = () => {
  const { productId } = useParams();
  const { data: product, isLoading, isError } = useProductDetail(productId);
  const { data: reviewsData } = useProductReviews(productId);
  const reviews = reviewsData?.reviews || [];
  const token = useAuthStore((s) => s.token);

  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [showStoreAlert, setShowStoreAlert] = useState(false);
  const [addError, setAddError] = useState("");

  const isLoggedIn = !!token;

  const addMutation = useAddToCart();
  const clearAndAddMutation = useClearAndAddToCart();

  const handleAddToCart = () => {
    addMutation.mutate(
      { productId, quantity: 1 },
      {
        onError: (err) => {
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
    clearAndAddMutation.mutate(productId, {
      onSuccess: () => setShowStoreAlert(false),
      onError: () => setAddError("Gagal menambahkan ke keranjang."),
    });
  };

  return (
    <MainLayout>
      <div className="max-w-[1280px] mx-auto w-full px-6 lg:px-8 py-8">
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

        {!isLoading && !isError && product && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="aspect-square bg-bg-tertiary flex items-center justify-center overflow-hidden">
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

            {/* Info */}
            <div className="flex flex-col gap-4">
              <h1 className="text-[2rem] font-bold text-text-primary">
                {product.name}
              </h1>

              <p className="text-3xl font-extrabold text-brand-deep">
                Rp{product.price?.toLocaleString("id-ID")}
              </p>

              {product.averageRating > 0 && (
                <div className="flex items-center gap-2">
                  <StarRating value={Math.round(product.averageRating)} readonly />
                  <span className="text-sm text-text-muted">
                    {product.averageRating} ({product.reviewCount} ulasan)
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
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
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary">Toko:</span>
                  <Link
                    to={`/stores/${product.store.id}`}
                    className="text-brand-deep font-semibold hover:underline"
                  >
                    {product.store.storeName}
                  </Link>
                </div>
              )}

              {product.category && (
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary">Kategori:</span>
                  <span className="text-xs bg-brand-subtle text-text-primary px-2 py-0.5 rounded font-medium">
                    {CATEGORY_LABEL[product.category] || product.category}
                  </span>
                </div>
              )}

              <div className="border-t-[3px] border-bg-tertiary pt-4 mt-2">
                <h2 className="font-bold text-lg text-text-primary mb-2">
                  Deskripsi
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  {product.description}
                </p>
              </div>

              {isLoggedIn ? (
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleAddToCart}
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={addMutation.isPending}
                    disabled={product.stock < 1}
                  >
                    {addMutation.isPending ? "Menambahkan..." : "Tambah ke Keranjang"}
                  </Button>
                  {addError && (
                    <p className="text-danger text-xs text-center">
                      {addError}
                    </p>
                  )}
                </div>
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
            </div>
          </div>
        )}

        {!isLoading && !isError && product && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-text-primary mb-6">
              Ulasan Pembeli{reviews.length > 0 ? ` (${product.reviewCount || reviews.length})` : ""}
            </h2>
            {reviews.length === 0 ? (
              <div className="card text-center py-10">
                <p className="text-text-muted">Belum ada ulasan untuk produk ini.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-text-primary">
                        {review.buyer?.username || "Pembeli"}
                      </span>
                      <span className="text-xs text-text-muted">
                        {new Date(review.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric", month: "long", year: "numeric",
                        })}
                      </span>
                    </div>
                    <StarRating value={review.rating} size="sm" readonly />
                    <p className="text-sm text-text-secondary mt-2">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
