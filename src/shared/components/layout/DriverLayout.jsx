import { Outlet } from "react-router-dom";
import MainLayout from "./MainLayout";
import DashboardSidebar from "./DashboardSidebar";

const sidebarLinks = [
  { to: "/dashboard/driver", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { to: "/dashboard/driver/jobs", label: "Pekerjaan Tersedia", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { to: "/dashboard/driver/history", label: "Riwayat", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  { to: "/dashboard/driver/income", label: "Pemasukkan", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
];

const DriverLayout = () => {
  return (
    <MainLayout navbarVariant="seller">
      <div className="flex min-h-[calc(100vh-4rem)]">
        <DashboardSidebar
          title="Driver"
          subtitle="Dashboard Kurir"
          links={sidebarLinks}
        />
        <div className="flex-1 p-6 lg:p-8 overflow-auto">
          <Outlet />
        </div>
      </div>
    </MainLayout>
  );
};

export default DriverLayout;
