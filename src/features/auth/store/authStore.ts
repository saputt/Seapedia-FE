import { create } from "zustand";
import type { AuthUser, RoleName } from "../../../types";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  userRoles: RoleName[];
  activeRole: RoleName | null;
}

interface AuthActions {
  login: (data: { token: string; user: AuthUser; roles: RoleName[]; activeRole: RoleName }) => void;
  setUser: (userData: Partial<AuthUser>) => void;
  logout: () => void;
  switchRole: (role: RoleName, newToken?: string, roles?: RoleName[]) => void;
}

type AuthStore = AuthState & AuthActions;

const getStored = <T>(key: string, fallback: T | null = null): T | null => {
  try {
    const val = localStorage.getItem(key);
    if (key === "user" && val) return JSON.parse(val) as T;
    if (key === "userRoles" && val) return JSON.parse(val) as T;
    return (val ?? fallback) as T | null;
  } catch {
    return fallback;
  }
};

const useAuthStore = create<AuthStore>((set) => ({
  token: getStored<string>("token"),
  user: getStored<AuthUser>("user"),
  userRoles: getStored<RoleName[]>("userRoles", []) ?? [],
  activeRole: getStored<RoleName>("activeRole"),

  login: ({ token, user, roles, activeRole }: { token: string; user: AuthUser; roles: RoleName[]; activeRole: RoleName }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("userRoles", JSON.stringify(roles));
    localStorage.setItem("activeRole", activeRole);
    set({ token, user, userRoles: roles, activeRole });
  },

  setUser: (userData: Partial<AuthUser>) => {
    set((state) => {
      const merged = { ...state.user!, ...userData };
      localStorage.setItem("user", JSON.stringify(merged));
      return { user: merged };
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRoles");
    localStorage.removeItem("activeRole");
    set({ token: null, user: null, userRoles: [], activeRole: null });
  },

  switchRole: (role: RoleName, newToken?: string, roles?: RoleName[]) => {
    localStorage.setItem("activeRole", role);
    if (newToken) localStorage.setItem("token", newToken);
    if (roles) localStorage.setItem("userRoles", JSON.stringify(roles));
    set({
      activeRole: role,
      ...(newToken ? { token: newToken } : {}),
      ...(roles ? { userRoles: roles } : {}),
    });
  },
}));

export default useAuthStore;
