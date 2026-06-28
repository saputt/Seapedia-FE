import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createProductReview, getProductReviews, getSellerReviews } from "../api/review.api";
import type { ReviewInput } from "../../../types";

export const useProductReviews = (productId: string) =>
  useQuery({
    queryKey: ["productReviews", productId],
    queryFn: () => getProductReviews(productId),
    enabled: !!productId,
  });

export const useSellerReviews = () =>
  useQuery({
    queryKey: ["sellerReviews"],
    queryFn: getSellerReviews,
  });

export const useCreateProductReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, ...data }: { productId: string } & ReviewInput) =>
      createProductReview(productId, data),
    onMutate: async ({ productId, rating, comment }) => {
      const reviewKey = ["productReviews", productId];
      await queryClient.cancelQueries({ queryKey: reviewKey });
      await queryClient.cancelQueries({ queryKey: ["product", productId] });
      const prevReviews = queryClient.getQueryData(reviewKey);
      const prevProduct = queryClient.getQueryData(["product", productId]);
      const tempId = `optimistic-${Date.now()}`;
      queryClient.setQueryData(reviewKey, (old: any) => {
        const newReview = { id: tempId, rating, comment, createdAt: new Date().toISOString(), buyer: { username: "Anda" } };
        if (!old) return { reviews: [newReview] };
        if (old.reviews) return { ...old, reviews: [newReview, ...old.reviews] };
        if (Array.isArray(old)) return [newReview, ...old];
        return old;
      });
      return { prevReviews, prevProduct, reviewKey, productId };
    },
    onError: (_err, _vars, context) => {
      if (context?.prevReviews) queryClient.setQueryData(context.reviewKey, context.prevReviews);
      if (context?.prevProduct) queryClient.setQueryData(["product", context.productId], context.prevProduct);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["buyer-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", (variables as any).orderId] });
    },
    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({ queryKey: ["productReviews", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
