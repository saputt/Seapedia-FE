import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAppReviews, submitAppReview } from "../api/landing.api";
import type { ReviewInput } from "../../../types";

export const useAppReviews = () => {
  return useQuery({
    queryKey: ["app-reviews"],
    queryFn: getAppReviews,
  });
};

export const useSubmitAppReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReviewInput) => submitAppReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["app-reviews"] });
    },
  });
};
