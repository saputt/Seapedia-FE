import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart, updateCartItem, removeCartItem, clearCart } from "../api/cart.api";
import useCartStore from "../store/cartStore";

const CART_QUERY_KEY = ["cart"];

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const refreshCart = useCartStore((s) => s.refreshCart);

  return useMutation({
    mutationFn: (input: { productId: string; quantity?: number; force?: boolean }) =>
      addToCart(input),
    onSuccess: () => {
      refreshCart();
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
};

export const useAddToCartWithForce = () => {
  const queryClient = useQueryClient();
  const refreshCart = useCartStore((s) => s.refreshCart);

  return useMutation({
    mutationFn: ({ productId, quantity = 1 }: { productId: string; quantity?: number }) =>
      addToCart({ productId, quantity, force: true }),
    onSuccess: () => {
      refreshCart();
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
};

export const useUpdateCartItem = () => {
  const setItems = useCartStore((s) => s.setItems);

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      updateCartItem(productId, quantity),
    onMutate: async ({ productId, quantity }) => {
      const previous = useCartStore.getState().items;
      setItems(
        previous.map((item) =>
          item.productId === productId
            ? { ...item, quantity }
            : item
        )
      );
      return { previous };
    },
    onError: (_err, { productId }, context) => {
      if (context?.previous) {
        setItems(context.previous);
      }
    },
  });
};

export const useRemoveCartItem = () => {
  const setItems = useCartStore((s) => s.setItems);

  return useMutation({
    mutationFn: (productId: string) => removeCartItem(productId),
    onMutate: async (productId) => {
      const previous = useCartStore.getState().items;
      setItems(previous.filter((item) => item.productId !== productId));
      return { previous };
    },
    onError: (_err, _productId, context) => {
      if (context?.previous) {
        setItems(context.previous);
      }
    },
  });
};

export const useClearCart = () => {
  const setItems = useCartStore((s) => s.setItems);

  return useMutation({
    mutationFn: () => clearCart(),
    onMutate: async () => {
      const previous = useCartStore.getState().items;
      setItems([]);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        setItems(context.previous);
      }
    },
  });
};

export const useClearAndAddToCart = () => {
  const queryClient = useQueryClient();
  const refreshCart = useCartStore((s) => s.refreshCart);
  const hideBadge = useCartStore((s) => s.hideBadge);

  return useMutation({
    // Force add clears the cart on the backend before adding the new item
    mutationFn: async ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
      return addToCart({ productId, quantity, force: true });
    },
    onSuccess: async () => {
      await refreshCart();
      hideBadge();
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["order-summary"] });
    },
    onError: () => {
      refreshCart();
    },
  });
};
