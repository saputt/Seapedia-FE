import { apiFetch } from "../../../api/client";

export const getFeaturedProducts = (limit = 6) =>
  apiFetch(`products?limit=${limit}`);

export const getAppReviews = () =>
  apiFetch("reviews");

export const submitAppReview = (data) =>
  apiFetch("reviews", {
    method: "POST",
    body: JSON.stringify(data),
  });
