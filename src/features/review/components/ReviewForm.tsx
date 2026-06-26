import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import { reviewSchema, type ReviewInput } from "@/shared/validations";
import StarRating from "@/shared/components/ui/StarRating";
import { useFormPersist } from "@/shared/hooks/useFormPersist";

interface ReviewFormProps {
  onSubmit: (data: ReviewInput) => void;
  isPending?: boolean;
  defaultValues?: Partial<ReviewInput>;
  onCancel?: () => void;
}

export const ReviewForm = ({ onSubmit, isPending = false, defaultValues, onCancel }: ReviewFormProps) => {
  const form = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      productId: "",
      orderItemId: "",
      rating: 0,
      comment: "",
      ...defaultValues,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = form;

  const { persist: persistForm, clearPersisted } = useFormPersist("review", form as any);
  const formValues = watch();
  useEffect(() => { persistForm(formValues); }, [formValues, persistForm]);

  const rating = watch("rating");

  const handleRatingChange = (value: number) => {
    setValue("rating", value);
  };

  const handleSubmitForm = (data: ReviewInput) => {
    clearPersisted();
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-5">
      <div>
        <label className="block text-text-secondary font-medium text-sm mb-2">Rating</label>
        <StarRating
          value={rating}
          onChange={handleRatingChange}
          size="lg"
          interactive
        />
        {errors.rating && <p className="text-danger text-sm mt-1">{errors.rating.message}</p>}
      </div>

      <div>
        <label className="block text-text-secondary font-medium text-sm mb-1.5">Ulasan Anda</label>
        <textarea
          {...register("comment")}
          className="input-neo w-full resize-none h-32"
          placeholder="Ceritakan pengalaman Anda dengan produk ini..."
          rows={4}
        />
        {errors.comment && <p className="text-danger text-sm mt-1">{errors.comment.message}</p>}
        <p className="text-text-muted text-xs mt-1">Minimal 10 karakter</p>
      </div>

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button type="button" onClick={onCancel} variant="ghost" fullWidth>
            Batal
          </Button>
        )}
        <Button type="submit" variant="primary" fullWidth loading={isPending} disabled={rating === 0}>
          {isPending ? "Mengirim..." : "Kirim Ulasan"}
        </Button>
      </div>
    </form>
  );
};