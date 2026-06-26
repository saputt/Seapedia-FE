import { useState } from "react";
import Button from "../../../shared/components/ui/Button";
import StarRating from "../../../shared/components/ui/StarRating";

interface DriverReviewModalProps {
  isOpen: boolean;
  driverName?: string;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  isPending?: boolean;
  error?: string | null;
}

const DriverReviewModal = ({
  isOpen,
  driverName,
  onClose,
  onSubmit,
  isPending = false,
  error = null,
}: DriverReviewModalProps) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    await onSubmit(rating, comment);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="card !p-6 mx-4 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-primary">Rating Driver</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {driverName && (
          <p className="text-sm text-text-muted mb-4">
            Beri rating untuk <span className="font-semibold text-text-primary">{driverName}</span>
          </p>
        )}

        {error && (
          <div className="mb-4 p-3 border-[3px] border-danger bg-danger/5">
            <p className="text-danger text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="flex justify-center mb-4">
          <StarRating value={rating} onChange={setRating} size="lg" />
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="input-neo w-full resize-none h-20 text-sm mb-4"
          placeholder="Tulis komentar (opsional)..."
        />

        <div className="flex gap-3">
          <Button type="button" onClick={onClose} variant="ghost" fullWidth>
            Batal
          </Button>
          <Button
            type="button"
            variant="primary"
            fullWidth
            loading={isPending}
            onClick={handleSubmit}
          >
            {isPending ? "Mengirim..." : "Kirim Rating"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DriverReviewModal;
