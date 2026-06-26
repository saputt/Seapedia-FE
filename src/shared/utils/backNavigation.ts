const PARENT_ROUTES: { prefix: string; parent: string }[] = [
  { prefix: "/wallet/history", parent: "/wallet" },
  { prefix: "/wallet", parent: "/" },
  { prefix: "/orders/", parent: "/orders" },
  { prefix: "/orders", parent: "/" },
  { prefix: "/products/", parent: "/" },
  { prefix: "/stores/", parent: "/stores" },
  { prefix: "/stores", parent: "/" },
  { prefix: "/checkout/success", parent: "/orders" },
  { prefix: "/cart", parent: "/" },
  { prefix: "/addresses", parent: "/" },
  { prefix: "/profile", parent: "/" },
  { prefix: "/about", parent: "/" },
  { prefix: "/auth", parent: "/" },
  { prefix: "/onboarding", parent: "/" },
  { prefix: "/dashboard/seller/products/", parent: "/dashboard/seller/products" },
  { prefix: "/dashboard/seller/", parent: "/dashboard/seller" },
  { prefix: "/dashboard/driver/", parent: "/dashboard/driver" },
  { prefix: "/dashboard/admin/", parent: "/dashboard/admin" },
];

export function getParentRoute(pathname: string): string {
  for (const { prefix, parent } of PARENT_ROUTES) {
    if (pathname.startsWith(prefix)) return parent;
  }
  return "/";
}

const CHECKOUT_ORIGIN_KEY = "checkout_origin";

export function saveCheckoutOrigin(path: string) {
  sessionStorage.setItem(CHECKOUT_ORIGIN_KEY, path);
}

export function getCheckoutOrigin(): string | null {
  try {
    const val = sessionStorage.getItem(CHECKOUT_ORIGIN_KEY);
    sessionStorage.removeItem(CHECKOUT_ORIGIN_KEY);
    return val;
  } catch {
    return null;
  }
}
