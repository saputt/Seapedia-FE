import { apiFetch } from "../../../api/client";

export const addToCart = (productId, quantity = 1) =>
  apiFetch(`cart/${productId}`, {
    method: "POST",
    body: JSON.stringify({ quantity }),
  });

export const fetchCart = () => apiFetch("cart");

export const updateCartItem = (productId, quantity) =>
  apiFetch(`cart/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });

export const removeCartItem = (productId) =>
  apiFetch(`cart/${productId}`, {
    method: "DELETE",
  });

export const clearCart = () =>
  apiFetch("cart", {
    method: "DELETE",
  });
