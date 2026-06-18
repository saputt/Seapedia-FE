import { create } from "zustand";

const useProductSearchStore = create((set) => ({
  query: "",
  setQuery: (query) => set({ query }),
}));

export default useProductSearchStore;
