import { useLocation, Link, Outlet } from "react-router-dom";
import MainLayout from "./MainLayout";

const sidebarLinks = [
  { to: "/dashboard/driver", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { to: "/dashboard/driver/jobs", label: "Pekerjaan Tersedia", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { to: "/dashboard/driver/history", label: "Riwayat", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
];

const NavIcon = ({ path }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

const DriverLayout = () => {
  const location = useLocation();

  return (
    <MainLayout navbarVariant="seller">
      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside className="w-60 shrink-0 border-r-[3px] border-brand-deep/20 bg-bg-secondary hidden lg:flex lg:flex-col">
          <div className="p-5 border-b-[3px] border-brand-deep/20">
            <h2 className="font-bold text-text-primary truncate">Driver</h2>
            <p className="text-xs text-text-muted">Dashboard Kurir</p>
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

export default DriverLayout;
