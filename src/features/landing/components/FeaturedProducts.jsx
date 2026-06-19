import ProductCard from "../../catalog/components/ProductCard";
import { useFeaturedProducts } from "../hooks/useFeaturedProducts";

const FeaturedProducts = () => {
  const { data, isLoading, isError } = useFeaturedProducts(6);

  const products = Array.isArray(data) ? data : data?.data || [];

  return (
    <section className="bg-bg-secondary py-16 md:py-20">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-[2rem] font-bold text-text-primary">
            Produk Unggulan
          </h2>
          <p className="mt-3 text-text-secondary text-lg">
            Beberapa produk pilihan untukmu
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-square bg-bg-tertiary mb-4" />
                <div className="h-5 bg-bg-tertiary rounded w-3/4 mb-2" />
                <div className="h-6 bg-bg-tertiary rounded w-1/3" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-12">
            <p className="text-danger font-semibold">
              Gagal memuat produk. Silakan coba lagi.
            </p>
          </div>
        )}

        {!isLoading && !isError && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary">
              Belum ada produk tersedia.
            </p>
          </div>
        )}

        {!isLoading && !isError && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
