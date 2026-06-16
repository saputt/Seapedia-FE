const BASE_URL = import.meta.env.VITE_API_URL

export async function apiFetch(
    endpoint,
    options
) {
   const token = localStorage.getItem('token') 

   const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
    },
   })

   if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || 'Something went wrong')
   }

   return res.json()
}