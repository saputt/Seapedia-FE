import { apiFetch } from "../../../api/client";
import type { DriverReview, ReviewInput } from "../../../types";

export const createDriverReview = (orderId: string, data: ReviewInput): Promise<DriverReview> =>
  apiFetch(`orders/${orderId}/driver-review`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getDriverReview = (orderId: string): Promise<DriverReview | null> =>
  apiFetch(`orders/${orderId}/driver-review`);

export const getMyDriverReviews = (): Promise<{
  reviews: DriverReview[];
  total: number;
  stats: { reviewCount: number; averageRating: number };
}> => apiFetch("reviews/driver");
