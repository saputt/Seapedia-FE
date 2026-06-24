import StarRating from "../../../shared/components/ui/StarRating";

interface Review {
  id: string;
  buyer?: { username: string };
  rating: number;
  comment: string;
  createdAt: string;
}

interface ProductReviewsProps {
  reviews: Review[];
  reviewCount: number;
  averageRating?: number;
}

const ProductReviews = ({ reviews, reviewCount, averageRating }: ProductReviewsProps) => {
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) distribution[r.rating]++;
  });

  const total = reviews.length;
  const satisfaction = total > 0
    ? Math.round((reviews.filter((r) => r.rating >= 4).length / total) * 100)
    : 0;

  const avg = averageRating ?? (
    total > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / total
      : 0
  );

  const maxCount = Math.max(...Object.values(distribution), 1);

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-text-primary mb-6">
        Ulasan Pembeli{reviews.length > 0 ? ` (${reviewCount})` : ""}
      </h2>

      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-8 py-4 px-3">
          {/* Left — rating summary */}
          <div className="flex flex-col items-center md:items-start justify-center min-w-[180px]">
            <div className="flex items-center gap-3">
              <span className="text-yellow-400 text-5xl">★</span>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-text-primary leading-none">{avg > 0 ? avg.toFixed(1) : "— "}</span>
                <span className="text-2xl text-text-secondary mt-0.5">/ 5.0</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-brand-deep mt-2">
              {satisfaction}% pembeli merasa puas
            </p>
            <p className="text-xs text-text-muted mt-1">
              {reviewCount} rating • {total} ulasan
            </p>
          </div>

          {/* Right — progress bars (2 columns) */}
          <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-2">
            <div className="space-y-2">
              {[5, 4, 3].map((star) => (
                <div key={star} className="flex items-center gap-3 text-sm">
                  <span className="w-4 text-right text-text-secondary font-medium">{star}</span>
                  <div className="flex-1 h-2.5 bg-bg-tertiary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all"
                      style={{ width: `${(distribution[star] / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-text-muted">{distribution[star]}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[2, 1].map((star) => (
                <div key={star} className="flex items-center gap-3 text-sm">
                  <span className="w-4 text-right text-text-secondary font-medium">{star}</span>
                  <div className="flex-1 h-2.5 bg-bg-tertiary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all"
                      style={{ width: `${(distribution[star] / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-text-muted">{distribution[star]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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
  );
};

export default ProductReviews;
