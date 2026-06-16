import { useState } from "react";
import { useAppReviews, useSubmitAppReview } from "../hooks/useAppReviews";

const StarInput = ({ value, onChange }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-2xl transition-colors ${
            star <= value ? "text-warning" : "text-bg-tertiary"
          } hover:text-warning`}
        >
          &#9733;
        </button>
      ))}
    </div>
  );
};

const ReviewCard = ({ review }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-text-primary">
          {review.reviewerName}
        </span>
        <div className="flex gap-0.5">
          {Array.from({ length: review.rating }).map((_, i) => (
            <span key={i} className="text-warning text-sm">&#9733;</span>
          ))}
        </div>
      </div>
      <p className="text-text-secondary text-sm leading-relaxed">
        {review.comment}
      </p>
      <p className="text-text-muted text-xs mt-3">
        {new Date(review.createdAt).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </div>
  );
};

const TestimonialSection = () => {
  const { data, isLoading, isError } = useAppReviews();
  const submitReview = useSubmitAppReview();

  const reviews = data?.reviews || [];

  const [form, setForm] = useState({ reviewerName: "", rating: 0, comment: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.reviewerName || !form.rating || !form.comment) return;

    submitReview.mutate(
      { reviewerName: form.reviewerName, rating: form.rating, comment: form.comment },
      {
        onSuccess: () => {
          setForm({ reviewerName: "", rating: 0, comment: "" });
          setSubmitted(true);
          setTimeout(() => setSubmitted(false), 3000);
        },
      }
    );
  };

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-[2rem] font-bold text-text-primary">
            Apa Kata Pengguna
          </h2>
          <p className="mt-3 text-text-secondary text-lg">
            Simak pengalaman mereka menggunakan SEAPEDIA
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Review Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <h3 className="font-bold text-lg text-text-primary mb-4">
                Beri Penilaian
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-text-secondary font-medium text-sm mb-1.5">
                    Nama
                  </label>
                  <input
                    type="text"
                    value={form.reviewerName}
                    onChange={(e) =>
                      setForm({ ...form, reviewerName: e.target.value })
                    }
                    className="input-neo w-full"
                    placeholder="Masukkan namamu"
                    maxLength={15}
                    required
                  />
                </div>
                <div>
                  <label className="block text-text-secondary font-medium text-sm mb-1.5">
                    Rating
                  </label>
                  <StarInput
                    value={form.rating}
                    onChange={(v) => setForm({ ...form, rating: v })}
                  />
                </div>
                <div>
                  <label className="block text-text-secondary font-medium text-sm mb-1.5">
                    Komentar
                  </label>
                  <textarea
                    value={form.comment}
                    onChange={(e) =>
                      setForm({ ...form, comment: e.target.value })
                    }
                    className="input-neo w-full min-h-[100px] resize-y"
                    placeholder="Tulis pengalamanmu..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={submitReview.isPending}
                >
                  {submitReview.isPending ? "Mengirim..." : "Kirim Review"}
                </button>
                {submitted && (
                  <p className="text-success font-semibold text-sm text-center">
                    Review berhasil dikirim! Terima kasih.
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Review List */}
          <div className="lg:col-span-3">
            {isLoading && (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-5 bg-bg-tertiary rounded w-1/3 mb-3" />
                    <div className="h-4 bg-bg-tertiary rounded w-full mb-2" />
                    <div className="h-4 bg-bg-tertiary rounded w-2/3" />
                  </div>
                ))}
              </div>
            )}

            {isError && (
              <div className="text-center py-12">
                <p className="text-danger font-semibold">
                  Gagal memuat review.
                </p>
              </div>
            )}

            {!isLoading && !isError && reviews.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-secondary">
                  Belum ada review. Jadilah yang pertama!
                </p>
              </div>
            )}

            {!isLoading && !isError && reviews.length > 0 && (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
