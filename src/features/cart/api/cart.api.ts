import { apiFetch } from "../../../api/client";
import type { CartItem } from "../../../types";
import { cartAddSchema, CartAddInput } from "../../../shared/validations";

export const addToCart = (input: CartAddInput): Promise<CartItem> => {
  // Validate input using Zod schema (throws if invalid)
  const validated = cartAddSchema.parse(input);
  return apiFetch(`cart/${validated.productId}`, {
    method: "POST",
    body: JSON.stringify({
      quantity: validated.quantity,
      force: validated.force ?? false,
    }),
  });
};

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
