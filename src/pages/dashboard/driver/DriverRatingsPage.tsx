import React, { useMemo, useState } from "react";
import { getMyDriverReviews } from "../../../features/driver/api/driverReview.api";
import StarRating from "../../../shared/components/ui/StarRating";
import FilterPill from "../../../shared/components/ui/FilterPill";
import Spinner from "../../../shared/components/ui/Spinner";
import ErrorState from "../../../shared/components/ui/ErrorState";
import { useQuery } from "@tanstack/react-query";

const RATING_FILTERS = [
  { key: "all", label: "Semua" },
  { key: "5", label: "★★★★★" },
  { key: "4", label: "★★★★" },
  { key: "3", label: "★★★" },
  { key: "2", label: "★★" },
  { key: "1", label: "★" },
];

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

const DriverRatingsPage: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["myDriverReviews"],
    queryFn: getMyDriverReviews,
  });
  const [selectedRating, setSelectedRating] = useState("all");

  const allReviews = data?.reviews ?? [];
  const stats = data?.stats;

  const filteredReviews = useMemo(() => {
    if (selectedRating === "all") return allReviews;
    return allReviews.filter((r: any) => r.rating === Number(selectedRating));
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
        <h1 className="text-2xl font-bold text-text-primary mb-1">Penilaian Driver</h1>
        <p className="text-sm text-text-muted mb-6">Lihat ulasan pembeli untuk layanan Anda</p>
        <ErrorState message="Gagal memuat ulasan." onRetry={() => window.location.reload()} />
      </>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-text-primary mb-1">Penilaian Driver</h1>
      <p className="text-sm text-text-muted mb-6">Lihat ulasan pembeli untuk layanan Anda</p>

      {stats && (
        <div className="card !p-5 mb-6 flex items-center gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-brand-deep">{stats.averageRating.toFixed(1)}</p>
            <StarRating value={Math.round(stats.averageRating)} size="sm" readonly />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">Rata-rata Rating</p>
            <p className="text-xs text-text-muted">{stats.reviewCount} ulasan</p>
          </div>
        </div>
      )}

      <FilterPill items={RATING_FILTERS} value={selectedRating} onChange={setSelectedRating} className="mb-6" />

      {allReviews.length === 0 && (
        <div className="card !p-8 text-center">
          <p className="text-text-muted">Belum ada ulasan untuk layanan Anda.</p>
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
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
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

export default DriverRatingsPage;
