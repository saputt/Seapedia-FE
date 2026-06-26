const PARENT_ROUTES: { prefix: string; parent: string }[] = [
  { prefix: "/wallet/history", parent: "/wallet" },
  { prefix: "/wallet", parent: "/" },
  { prefix: "/orders/", parent: "/orders" },
  { prefix: "/orders", parent: "/" },
  { prefix: "/products/", parent: "/products" },
  { prefix: "/products", parent: "/" },
  { prefix: "/stores/", parent: "/stores" },
  { prefix: "/stores", parent: "/" },
  { prefix: "/checkout/success", parent: "/orders" },
  { prefix: "/checkout", parent: "/cart" },
  { prefix: "/cart", parent: "/products" },
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
