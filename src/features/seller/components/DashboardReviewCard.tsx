import { VTLink as Link } from "../../../shared/utils/VTLink";
import StarRating from "../../../shared/components/ui/StarRating";
import Spinner from "../../../shared/components/ui/Spinner";
import type { Product } from "../../../types";
import { useSellerReviews } from "../../review/hooks/useReviews";

interface DashboardReviewCardProps {
  products: Product[];
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  return new Date(dateStr).toLocaleDateString("id-ID");
}

const DashboardReviewCard = ({ products }: DashboardReviewCardProps) => {
  const { data: reviewsData, isLoading } = useSellerReviews() as any;

  const reviews = reviewsData?.reviews ?? [];
  const totalReviews = reviewsData?.total ?? 0;

  const productsWithRating = products.filter((p: any) => (p as any).averageRating > 0);
  const avgRating = productsWithRating.length > 0
    ? productsWithRating.reduce((sum: number, p: any) => sum + (p as any).averageRating, 0) / productsWithRating.length
    : 0;

  const latestReviews = [...reviews].slice(0, 3);

  return (
    <div className="card !p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">
          Ulasan Pembeli
        </h3>
        {avgRating > 0 && (
          <div className="flex items-center gap-1.5">
            <StarRating value={Math.round(avgRating)} size="sm" readonly />
            <span className="text-sm font-bold text-text-primary">
              {avgRating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {totalReviews === 0 && (
        <p className="text-sm text-text-muted text-center py-4">Belum ada ulasan</p>
      )}

      {isLoading && (
        <div className="flex justify-center py-4">
          <Spinner size="sm" />
        </div>
      )}

      {!isLoading && latestReviews.length > 0 && (
        <div className="space-y-3 mb-4">
          {latestReviews.map((review: any) => (
            <div key={review.id} className="border-b-2 border-border-default pb-3 last:border-b-0 last:pb-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-medium text-text-primary">{review.buyer?.username ?? "Pembeli"}</span>
                <span className="text-[10px] text-text-muted">·</span>
                <span className="text-[10px] text-text-muted">{timeAgo(review.createdAt)}</span>
              </div>
              <StarRating value={review.rating} size="sm" readonly />
              {review.comment && (
                <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">{review.comment}</p>
              )}
              {review.product?.name && (
                <p className="text-[10px] text-text-muted mt-0.5">
                  Produk: {review.product.name}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {totalReviews > 0 && (
        <Link
          to="/dashboard/seller/ratings"
          className="block text-center text-xs font-semibold text-brand-deep pt-3 border-t-3 border-border-default hover:opacity-80 transition-opacity"
        >
          Lihat semua penilaian ({totalReviews}) →
        </Link>
      )}
    </div>
  );
};

export default DashboardReviewCard;
