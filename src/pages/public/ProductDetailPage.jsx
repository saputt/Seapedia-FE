import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../../shared/components/layout/MainLayout";
import AlertModal from "../../shared/components/ui/AlertModal";
import { useProductDetail } from "../../features/catalog/hooks/useProductDetail";
import useAuthStore from "../../features/auth/store/authStore";
import useCartStore from "../../features/cart/store/cartStore";
import { addToCart, clearCart } from "../../features/cart/api/cart.api";

const ProductDetailPage = () => {
  const { productId } = useParams();
  const { data: product, isLoading, isError } = useProductDetail(productId);
  const token = useAuthStore((s) => s.token);
  const hideBadge = useCartStore((s) => s.hideBadge);
  const refreshCart = useCartStore((s) => s.refreshCart);

  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [showStoreAlert, setShowStoreAlert] = useState(false);
  const [addError, setAddError] = useState("");
  const [adding, setAdding] = useState(false);

  const isLoggedIn = !!token;

  const handleAddToCart = async () => {
    setAdding(true);
    setAddError("");
    try {
      await addToCart(productId, 1);
      await refreshCart();
      hideBadge();
    } catch (err) {
      const msg = err?.message || "";
      if (msg.includes("cart must be one store only")) {
        setShowStoreAlert(true);
      } else {
        setAddError(msg || "Gagal menambahkan ke keranjang.");
      }
    } finally {
      setAdding(false);
    }
  };

  const handleClearAndAdd = async () => {
    setAdding(true);
    try {
      await clearCart();
      await addToCart(productId, 1);
      await refreshCart();
      hideBadge();
      setShowStoreAlert(false);
    } catch {
      setAddError("Gagal menambahkan ke keranjang.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-[1280px] mx-auto w-full px-6 lg:px-8 py-8">
        <Link
          to="/products"
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
              to="/products"
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
                  <button
                    onClick={handleAddToCart}
                    disabled={adding || product.stock < 1}
                    className="btn-primary w-full !py-3 mt-4 text-base"
                  >
                    {adding ? "Menambahkan..." : "Tambah ke Keranjang"}
                  </button>
                  {addError && (
                    <p className="text-danger text-xs text-center">
                      {addError}
                    </p>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginAlert(true)}
                  className="btn-primary w-full !py-3 mt-4 text-base cursor-pointer"
                >
                  Tambah ke Keranjang
                </button>
              )}
            </div>
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
