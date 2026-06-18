import { useLocation, Link, Outlet } from "react-router-dom";
import MainLayout from "./MainLayout";

const sidebarLinks = [
  { to: "/dashboard/admin", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { to: "/dashboard/admin/orders", label: "Pesanan", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { to: "/dashboard/admin/promo", label: "Promo", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { to: "/dashboard/admin/voucher", label: "Voucher", icon: "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" },
];

const NavIcon = ({ path }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

const AdminLayout = () => {
  const location = useLocation();

  return (
    <MainLayout navbarVariant="seller">
      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside className="w-60 shrink-0 border-r-[3px] border-brand-deep/20 bg-bg-secondary hidden lg:flex lg:flex-col">
          <div className="p-5 border-b-[3px] border-brand-deep/20">
            <h2 className="font-bold text-text-primary">Admin Panel</h2>
            <p className="text-xs text-text-muted">Manajemen Sistem</p>
          </div>
          <nav className="p-3 space-y-1 flex-1">
            {sidebarLinks.map((link) => {
              const isActive = link.to === location.pathname;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-brand-deep text-white border-2 border-brand-deep neoshadow-sm"
                      : "text-text-secondary border-2 border-transparent hover:text-brand-deep hover:bg-white hover:border-brand-deep hover:neoshadow-sm hover:-translate-y-0.5 active:neoshadow active:translate-y-0"
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
          <Outlet />
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminLayout;
