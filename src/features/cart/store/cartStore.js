import { create } from "zustand";
import { fetchCart as fetchCartApi } from "../api/cart.api";

const useCartStore = create((set) => ({
  items: [],
  badgeVisible: false,

  setItems: (items) => set({ items }),

  setBadgeVisible: (v) => set({ badgeVisible: v }),

  refreshCart: async () => {
    try {
      const data = await fetchCartApi();
      const items = Array.isArray(data) ? data : [];
      set({ items, badgeVisible: items.length > 0 });
      return items;
    } catch {
      return [];
    }
  },

  hideBadge: () => set({ badgeVisible: false }),
}));

export default useCartStore;
