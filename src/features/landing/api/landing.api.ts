import { apiFetch } from "../../../api/client";
import type { AppReview, PaginatedResponse, Product, ReviewInput } from "../../../types";

export const getFeaturedProducts = (limit = 6): Promise<PaginatedResponse<Product>> =>
  apiFetch(`products?limit=${limit}`);

export const getAppReviews = (): Promise<AppReview[]> =>
  apiFetch("reviews");

export const submitAppReview = (data: ReviewInput): Promise<AppReview> =>
  apiFetch("reviews", {
    method: "POST",
    body: JSON.stringify(data),
  });
