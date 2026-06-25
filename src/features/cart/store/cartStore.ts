import { create } from "zustand";
import { fetchCart as fetchCartApi } from "../api/cart.api";
import type { CartItem } from "../../../types";

interface CartState {
  items: CartItem[];
  badgeVisible: boolean;
}

interface CartActions {
  setItems: (items: CartItem[]) => void;
  setBadgeVisible: (v: boolean) => void;
  refreshCart: () => Promise<CartItem[]>;
  hideBadge: () => void;
}

type CartStore = CartState & CartActions;

const useCartStore = create<CartStore>((set) => ({
  items: [],
  badgeVisible: false,

  setItems: (items: CartItem[]) => set({ items }),

  setBadgeVisible: (v: boolean) => set({ badgeVisible: v }),

  refreshCart: async () => {
    try {
      const data = await fetchCartApi();
      const items = Array.isArray(data) ? (data as CartItem[]) : [];
      set({ items, badgeVisible: items.length > 0 });
      return items;
    } catch (error) {
      console.error("Failed to refresh cart:", error);
      return [];
    }
  },

  hideBadge: () => set({ badgeVisible: false }),
}));

export default useCartStore;
