import { apiFetch } from "../../../api/client";
import type { ProductReview, ReviewInput } from "../../../types";

export const createProductReview = (productId: string, data: ReviewInput): Promise<ProductReview> =>
  apiFetch(`products/${productId}/reviews`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getProductReviews = (productId: string): Promise<ProductReview[]> =>
  apiFetch(`products/${productId}/reviews`);

export const getSellerReviews = (): Promise<any> =>
  apiFetch(`reviews/seller`);
