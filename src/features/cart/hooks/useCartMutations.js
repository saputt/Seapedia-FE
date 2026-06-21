import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart, updateCartItem, removeCartItem, clearCart } from "../api/cart.api";
import useCartStore from "../store/cartStore";

const CART_QUERY_KEY = ["cart"];

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const refreshCart = useCartStore((s) => s.refreshCart);

  return useMutation({
    mutationFn: ({ productId, quantity = 1 }) => addToCart(productId, quantity),
    onSuccess: () => {
      refreshCart();
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
};

export const useUpdateCartItem = () => {
  const setItems = useCartStore((s) => s.setItems);

  return useMutation({
    mutationFn: ({ productId, quantity }) => updateCartItem(productId, quantity),
    onSuccess: (updated, { productId }) => {
      const currentItems = useCartStore.getState().items;
      setItems(
        currentItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: updated.quantity }
            : item
        )
      );
    },
  });
};

export const useRemoveCartItem = () => {
  const setItems = useCartStore((s) => s.setItems);

  return useMutation({
    mutationFn: (productId) => removeCartItem(productId),
    onSuccess: (_data, productId) => {
      const currentItems = useCartStore.getState().items;
      setItems(currentItems.filter((item) => item.productId !== productId));
    },
  });
};

export const useClearCart = () => {
  const setItems = useCartStore((s) => s.setItems);

  return useMutation({
    mutationFn: () => clearCart(),
    onSuccess: () => {
      setItems([]);
    },
  });
};

export const useClearAndAddToCart = () => {
  const queryClient = useQueryClient();
  const refreshCart = useCartStore((s) => s.refreshCart);
  const hideBadge = useCartStore((s) => s.hideBadge);

  return useMutation({
    mutationFn: async (productId) => {
      await clearCart();
      return addToCart(productId, 1);
    },
    onSuccess: async () => {
      await refreshCart();
      hideBadge();
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
};
