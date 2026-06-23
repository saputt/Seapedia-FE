import React from "react";
import StarRating from "../../../shared/components/ui/StarRating";
import Spinner from "../../../shared/components/ui/Spinner";
import type { StoreReview } from "../../../types";

interface StoreReviewsProps {
  reviews: StoreReview[];
  total: number;
  averageRating: number;
  isLoading: boolean;
}

const StoreReviews: React.FC<StoreReviewsProps> = ({
  reviews,
  total,
  averageRating,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-text-secondary">Belum ada ulasan untuk toko ini.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6 p-4 bg-brand-subtle/30 rounded-lg">
        <div className="text-center">
          <p className="text-3xl font-bold text-text-primary">{averageRating.toFixed(1)}</p>
          <StarRating rating={Math.round(averageRating)} size="sm" />
          <p className="text-xs text-text-muted mt-1">{total} ulasan</p>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border border-border rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-semibold text-text-primary">{review.buyer.username}</p>
                <p className="text-xs text-text-muted">
                  {new Date(review.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <StarRating rating={review.rating} size="sm" />
            </div>
            <p className="text-xs text-text-muted mb-1">Produk: {review.product.name}</p>
            <p className="text-sm text-text-secondary">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreReviews;
