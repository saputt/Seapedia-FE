import { create } from "zustand";

const getStored = (key, fallback = null) => {
  try {
    const val = localStorage.getItem(key);
    if (key === "user" && val) return JSON.parse(val);
    if (key === "userRoles" && val) return JSON.parse(val);
    return val ?? fallback;
  } catch {
    return fallback;
  }
};

const useAuthStore = create((set) => ({
  token: getStored("token"),
  user: getStored("user"),
  userRoles: getStored("userRoles", []),
  activeRole: getStored("activeRole"),

  login: ({ token, user, roles, activeRole }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("userRoles", JSON.stringify(roles));
    localStorage.setItem("activeRole", activeRole);
    set({ token, user, userRoles: roles, activeRole });
  },

  setUser: (userData) => {
    const merged = { ...getStored("user"), ...userData };
    localStorage.setItem("user", JSON.stringify(merged));
    set({ user: merged });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRoles");
    localStorage.removeItem("activeRole");
    set({ token: null, user: null, userRoles: [], activeRole: null });
  },

  switchRole: (role, newToken) => {
    localStorage.setItem("activeRole", role);
    if (newToken) localStorage.setItem("token", newToken);
    set({ activeRole: role, ...(newToken ? { token: newToken } : {}) });
  },
}));

export default useAuthStore;
