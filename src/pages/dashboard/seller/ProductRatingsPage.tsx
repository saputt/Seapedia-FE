import React, { useMemo } from "react";
import { useSellerReviews } from "../../../features/review/hooks/useReviews";
import StarRating from "../../../shared/components/ui/StarRating";
import Spinner from "../../../shared/components/ui/Spinner";
import ErrorState from "../../../shared/components/ui/ErrorState";

const RATING_FILTERS = [
  { label: "Semua", value: null },
  { label: "★★★★★", value: 5 },
  { label: "★★★★", value: 4 },
  { label: "★★★", value: 3 },
  { label: "★★", value: 2 },
  { label: "★", value: 1 },
] as const;

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  return new Date(dateStr).toLocaleDateString("id-ID");
}

const ProductRatingsPage: React.FC = () => {
  const { data: reviewsData, isLoading, error } = useSellerReviews() as any;
  const [selectedRating, setSelectedRating] = React.useState<number | null>(null);

  const allReviews = reviewsData?.reviews ?? [];

  const filteredReviews = useMemo(() => {
    if (selectedRating === null) return allReviews;
    return allReviews.filter((r: any) => r.rating === selectedRating);
  }, [allReviews, selectedRating]);

  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <h1 className="text-2xl font-bold text-text-primary mb-1">Penilaian Produk</h1>
        <p className="text-sm text-text-muted mb-6">Lihat ulasan pembeli untuk produk toko Anda</p>
        <ErrorState message="Gagal memuat ulasan." onRetry={() => window.location.reload()} />
      </>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-text-primary mb-1">Penilaian Produk</h1>
      <p className="text-sm text-text-muted mb-6">Lihat ulasan pembeli untuk produk toko Anda</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {RATING_FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => setSelectedRating(f.value)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border-3 transition-colors ${
              selectedRating === f.value
                ? "bg-brand-deep text-white border-brand-deep"
                : "border-border bg-white text-text-secondary hover:bg-brand-subtle"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {allReviews.length === 0 && (
        <div className="card !p-8 text-center">
          <p className="text-text-muted">Belum ada ulasan untuk produk toko Anda.</p>
        </div>
      )}

      {filteredReviews.length === 0 && allReviews.length > 0 && (
        <div className="card !p-8 text-center">
          <p className="text-text-muted">Tidak ada ulasan dengan rating tersebut.</p>
        </div>
      )}

      <div className="space-y-3">
        {filteredReviews.map((review: any) => (
          <div key={review.id} className="card !p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-bg-tertiary overflow-hidden shrink-0">
                {review.product?.imageUrl ? (
                  <img src={review.product.imageUrl} alt={review.product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-text-muted">Img</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-text-primary truncate">
                    {review.product?.name ?? "Produk"}
                  </span>
                  <span className="text-[10px] bg-brand-subtle text-text-muted px-1.5 py-0.5 rounded shrink-0">
                    {review.product?.category ?? ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating value={review.rating} size="sm" readonly />
                  <span className="text-xs text-text-muted">
                    {review.buyer?.username ?? "Pembeli"}
                  </span>
                  <span className="text-xs text-text-muted">·</span>
                  <span className="text-xs text-text-muted">{timeAgo(review.createdAt)}</span>
                </div>
                {review.comment && (
                  <p className="text-sm text-text-secondary mt-2 bg-brand-subtle/50 rounded-lg p-3">
                    {review.comment}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductRatingsPage;
