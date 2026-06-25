import { isTokenExpired } from "../shared/utils/jwt";

const BASE_URL: string = import.meta.env.VITE_API_URL as string;

function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("userRoles");
  localStorage.removeItem("activeRole");
}

function redirectToLogin() {
  if (window.location.pathname.startsWith("/auth/")) return;
  clearAuth();
  window.location.href = "/auth/login";
}

function getValidToken(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;
  if (isTokenExpired(token)) {
    clearAuth();
    return null;
  }
  return token;
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = getValidToken();

  const isFormData = options?.body instanceof FormData;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers as Record<string, string> | undefined),
    },
  });

  if (res.status === 401) {
    redirectToLogin();
    throw new Error("Session expired. Please login again.");
  }

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Something went wrong");
  }

  return result.data !== undefined ? result.data : (result as T);
}
