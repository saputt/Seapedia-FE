import type { Product } from "../../../types";

interface AverageRatingCardProps {
  products: Product[];
}

const AverageRatingCard = ({ products }: AverageRatingCardProps) => {
  const productsWithRating = products.filter((p) => (p as any).averageRating > 0);
  const totalProducts = products.length;

  if (totalProducts === 0) {
    return null;
  }

  const averageRating =
    productsWithRating.length > 0
      ? productsWithRating.reduce((sum, p) => sum + (p as any).averageRating, 0) /
        productsWithRating.length
      : 0;

  const totalReviews = products.reduce(
    (sum, p) => sum + ((p as any).reviewCount || 0),
    0
  );

  const fullStars = Math.floor(averageRating);
  const hasHalf = averageRating - fullStars >= 0.5;

  return (
    <div className="card !p-5">
      <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-4">
            Rating Produk
      </h3>
      <div className="flex items-center gap-4 mb-3">
        <span className="text-4xl font-bold text-text-primary">
          {averageRating > 0 ? averageRating.toFixed(1) : "—"}
        </span>
        <div>
          {averageRating > 0 && (
            <div className="flex gap-0.5 text-lg">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={
                    star <= fullStars
                      ? "text-yellow-400"
                      : star === fullStars + 1 && hasHalf
                        ? "text-yellow-400"
                        : "text-gray-300"
                  }
                >
                  {star <= fullStars || (star === fullStars + 1 && hasHalf) ? "★" : "☆"}
                </span>
              ))}
            </div>
          )}
          <p className="text-xs text-text-muted mt-0.5">
            {totalReviews} ulasan dari {productsWithRating.length} produk
          </p>
        </div>
      </div>
      <div className="space-y-1.5">
        {productsWithRating
          .sort((a, b) => (b as any).averageRating - (a as any).averageRating)
          .slice(0, 3)
          .map((product) => (
            <div key={product.id} className="flex items-center justify-between text-xs">
              <span className="text-text-primary truncate mr-2">{product.name}</span>
              <span className="shrink-0 font-bold text-text-primary">
                {(product as any).averageRating.toFixed(1)}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AverageRatingCard;
