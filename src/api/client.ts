const BASE_URL: string = import.meta.env.VITE_API_URL as string;

export async function apiFetch<T = unknown>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem("token");

  const isFormData = options?.body instanceof FormData;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers as Record<string, string> | undefined),
    },
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Something went wrong");
  }

  return result.data !== undefined ? result.data : (result as T);
}
