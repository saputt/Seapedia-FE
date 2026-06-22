import { apiFetch } from "../../../api/client";
import type { CartItem } from "../../../types";

export const addToCart = (productId: string, quantity = 1, force = false): Promise<CartItem> =>
  apiFetch(`cart/${productId}`, {
    method: "POST",
    body: JSON.stringify({ quantity, force }),
  });

export const fetchCart = (): Promise<CartItem[]> => apiFetch("cart");

export const updateCartItem = (productId: string, quantity: number): Promise<CartItem> =>
  apiFetch(`cart/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });

export const removeCartItem = (productId: string): Promise<void> =>
  apiFetch(`cart/${productId}`, {
    method: "DELETE",
  });

export const clearCart = (): Promise<void> =>
  apiFetch("cart", {
    method: "DELETE",
  });
