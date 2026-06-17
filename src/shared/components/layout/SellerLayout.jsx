import { useLocation, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "./MainLayout";
import { getMyStore } from "../../../features/store/api/store.api";

const sidebarLinks = [
  { to: "/dashboard/seller", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { to: "/dashboard/seller/store", label: "Toko Saya", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { to: "/dashboard/seller/products", label: "Produk", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { to: "/dashboard/seller/orders", label: "Pesanan", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
];

const NavIcon = ({ path }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

const SellerLayout = ({ children }) => {
  const location = useLocation();

  const { data: store } = useQuery({
    queryKey: ["myStore"],
    queryFn: getMyStore,
  });

  return (
    <MainLayout navbarVariant="default">
      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside className="w-60 shrink-0 border-r-[3px] border-brand-deep/20 bg-bg-secondary hidden lg:flex lg:flex-col">
          <div className="p-5 border-b-[3px] border-brand-deep/20">
            <h2 className="font-bold text-text-primary truncate">{store?.storeName || "Toko Saya"}</h2>
            <p className="text-xs text-text-muted">Dashboard Penjual</p>
          </div>
          <nav className="p-3 space-y-1 flex-1">
            {sidebarLinks.map((link) => {
              const isActive = link.to === location.pathname;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 neoborder ${
                    isActive
                      ? "bg-brand-subtle text-brand-deep border-brand-deep neoshadow-sm -translate-y-0.5"
                      : "border-transparent text-text-secondary hover:text-brand-deep hover:bg-brand-subtle hover:border-brand-deep hover:neoshadow-sm hover:-translate-y-0.5 active:neoshadow active:translate-y-0"
                  }`}
                >
                  <NavIcon path={link.icon} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </div>
      </div>
    </MainLayout>
  );
};

export default SellerLayout;
