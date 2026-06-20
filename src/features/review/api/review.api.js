import { apiFetch } from "../../../api/client";

export const createProductReview = (productId, data) =>
  apiFetch(`products/${productId}/reviews`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getProductReviews = (productId) =>
  apiFetch(`products/${productId}/reviews`);
