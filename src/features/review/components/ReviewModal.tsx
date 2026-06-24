import { useState } from "react";
import Button from "../../../shared/components/ui/Button";
import StarRating from "../../../shared/components/ui/StarRating";

interface ReviewOrder {
  id?: string;
  store?: { storeName?: string };
  orderItems?: Array<{
    product?: { id: string; name?: string; imageUrl?: string };
    productId?: string;
  }>;
  product?: { id?: string; name?: string; imageUrl?: string };
  productId?: string;
  alreadyReviewed?: boolean;
}

interface ReviewProduct {
  id: string;
  name: string;
  imageUrl?: string;
}

interface ReviewData {
  [productId: string]: {
    rating?: number;
    comment?: string;
    submitted?: boolean;
  };
}

interface ReviewModalProps {
  order: ReviewOrder | null;
  onClose: () => void;
  onSubmit: (productId: string, rating: number, comment: string) => Promise<void>;
  isPending?: boolean;
  error?: Error | null;
  multiProduct?: boolean;
}

const ReviewModal = ({
  order,
  onClose,
  onSubmit,
  isPending = false,
  error = null,
  multiProduct = false,
}: ReviewModalProps) => {
  const [reviewData, setReviewData] = useState<ReviewData>({});

  if (!order) return null;

  const handleReviewChange = (productId: string, field: string, value: string | number) => {
    setReviewData((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  };

  const handleSubmitSingle = async (productId: string) => {
    const rd = reviewData[productId] || {};
    await onSubmit(productId, rd.rating || 5, rd.comment || "");
    setReviewData((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], submitted: true },
    }));
  };

  const products: ReviewProduct[] = multiProduct
    ? order.orderItems?.map((item) => ({
        id: item.product?.id || item.productId || "",
        name: item.product?.name || "Produk",
        imageUrl: item.product?.imageUrl,
      })) || []
    : [
        {
          id: order.product?.id || order.productId || "",
          name: order.product?.name || "Produk",
          imageUrl: order.product?.imageUrl,
        },
      ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="card !p-6 mx-4 w-full max-w-md max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-primary">Beri Rating</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {multiProduct && (
          <p className="text-sm text-text-muted mb-4">
            Pesanan #{order.id?.slice(0, 8)} — {order.store?.storeName}
          </p>
        )}

        {error && (
          <div className="mb-4 p-3 border-[3px] border-danger bg-danger/5">
            <p className="text-danger text-sm font-medium">
              {error.message || "Gagal mengirim review"}
            </p>
          </div>
        )}

        <div className="space-y-6">
          {products.map((product) => {
            const alreadyReviewed =
              !multiProduct && order.alreadyReviewed;
            const rd = reviewData[product.id] || {};

            return (
              <div
                key={product.id}
                className="border-b border-border pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-subtle flex-shrink-0 overflow-hidden">
                    <img
                      src={product.imageUrl || "/placeholder.png"}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm font-medium text-text-primary truncate flex-1">
                    {product.name}
                  </p>
                </div>

                {alreadyReviewed || rd.submitted ? (
                  <p className="text-xs text-success font-semibold">
                    ✓ Sudah direview
                  </p>
                ) : (
                  <>
                    <div className="mb-3">
                      <StarRating
                        value={rd.rating || 5}
                        onChange={(v: number) =>
                          handleReviewChange(product.id, "rating", v)
                        }
                        size="lg"
                      />
                    </div>
                    <textarea
                      value={rd.comment || ""}
                      onChange={(e) =>
                        handleReviewChange(
                          product.id,
                          "comment",
                          e.target.value,
                        )
                      }
                      className="input-neo w-full resize-none h-20 text-sm"
                      placeholder="Tulis review Anda..."
                    />
                    <div className="mt-2 text-right">
                      <Button
                        size="sm"
                        variant="primary"
                        loading={isPending}
                        disabled={!rd.comment?.trim()}
                        onClick={() => handleSubmitSingle(product.id)}
                      >
                        {isPending ? "Mengirim..." : "Kirim"}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {!multiProduct && (
          <div className="flex gap-3 mt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="ghost"
              fullWidth
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="primary"
              fullWidth
              loading={isPending}
              disabled={!products[0]?.id || !reviewData[products[0]?.id]?.comment?.trim()}
              onClick={() => products[0]?.id && handleSubmitSingle(products[0].id)}
            >
              {isPending ? "Mengirim..." : "Kirim Review"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewModal;
