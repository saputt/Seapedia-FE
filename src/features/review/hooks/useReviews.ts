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
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ["productReviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
