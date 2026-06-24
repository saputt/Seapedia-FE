import { Outlet, useLocation, Link } from "react-router-dom";
import Navbar from "./Navbar";
import BuyerBottomNav from "./BuyerBottomNav";
import { SidebarLink } from "../../../types";

const NavIcon = ({ path }: { path: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

const buyerNavLinks: SidebarLink[] = [
  { to: "/addresses", label: "Alamat", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" },
  { to: "/wallet", label: "Wallet", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
  { to: "/orders", label: "Pesanan", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
  { to: "/profile", label: "Profil", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
];

const BuyerDashboardLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar variant="default" />
      <div className="flex flex-1">
        <aside className="w-60 shrink-0 border-r-[3px] border-brand-deep/20 bg-bg-secondary hidden lg:flex lg:flex-col sticky top-16 self-start h-[calc(100vh-4rem)]">
          <div className="p-5 border-b-[3px] border-brand-deep/20">
            <h2 className="font-bold text-text-primary">Akun Saya</h2>
            <p className="text-xs text-text-muted">Pengaturan Akun</p>
          </div>
          <nav className="p-3 space-y-1 flex-1">
            {buyerNavLinks.map((link) => {
              const isActive = link.to === location.pathname || location.pathname.startsWith(link.to + "/");
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

        <div className="flex-1 p-6 lg:p-8 overflow-auto pb-20 md:pb-8">
          <Outlet />
        </div>
      </div>
      <BuyerBottomNav />
    </div>
  );
};

export default BuyerDashboardLayout;
