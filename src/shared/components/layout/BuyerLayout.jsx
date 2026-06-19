import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import DashboardSidebar from "./DashboardSidebar";

const links = [
  {
    to: "/dashboard/buyer/wallet",
    label: "Wallet",
    icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  },
  {
    to: "/dashboard/buyer/orders",
    label: "Pesanan",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
  },
  {
    to: "/dashboard/buyer/profile",
    label: "Profil",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
];

const BuyerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />
      <div className="flex flex-1">
        <DashboardSidebar title="Pembeli" subtitle="Dashboard Pembeli" links={links} />
        <div className="flex-1 p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default BuyerLayout;
