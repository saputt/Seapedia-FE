import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createProductReview, getProductReviews } from "../api/review.api";

export const useProductReviews = (productId) =>
  useQuery({
    queryKey: ["productReviews", productId],
    queryFn: () => getProductReviews(productId),
    enabled: !!productId,
  });

export const useCreateProductReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, ...data }) => createProductReview(productId, data),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ["productReviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
