import { apiFetch } from "../../../api/client";
import type { AppReview, ReviewInput } from "../../../types";

export const getAppReviews = (): Promise<AppReview[]> =>
  apiFetch("reviews");

export const submitAppReview = (data: ReviewInput): Promise<AppReview> =>
  apiFetch("reviews", {
    method: "POST",
    body: JSON.stringify(data),
  });
