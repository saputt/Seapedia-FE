import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../shared/components/layout/Navbar";
import Footer from "../../shared/components/layout/Footer";
import AlertModal from "../../shared/components/ui/AlertModal";
import { useProductDetail } from "../../features/catalog/hooks/useProductDetail";
import useAuthStore from "../../features/auth/store/authStore";

const ProductDetailPage = () => {
  const { productId } = useParams();
  const { data: product, isLoading, isError } = useProductDetail(productId);
  const token = useAuthStore((s) => s.token);
  const [showAlert, setShowAlert] = useState(false);

  const isLoggedIn = !!token;

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />

      <main className="flex-1 max-w-[1280px] mx-auto w-full px-6 lg:px-8 py-8">
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
                <>
                  <button className="btn-primary w-full !py-3 mt-4 text-base" disabled>
                    Tambah ke Keranjang
                  </button>
                  <p className="text-text-muted text-xs text-center">
                    *Fitur keranjang akan tersedia setelah login sebagai Pembeli
                  </p>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowAlert(true)}
                    className="btn-primary w-full !py-3 mt-4 text-base cursor-pointer"
                  >
                    Tambah ke Keranjang
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        icon="🔒"
        title="Login Diperlukan"
        message="Silakan masuk atau daftar akun terlebih dahulu untuk dapat menambahkan produk ke keranjang."
        actionLabel="Masuk"
        actionTo="/auth/login"
      />

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
