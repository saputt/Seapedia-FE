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
}

const ProductReviews = ({ reviews, reviewCount }: ProductReviewsProps) => (
  <div className="mt-12">
    <h2 className="text-xl font-bold text-text-primary mb-6">
      Ulasan Pembeli{reviews.length > 0 ? ` (${reviewCount})` : ""}
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
);

export default ProductReviews;
