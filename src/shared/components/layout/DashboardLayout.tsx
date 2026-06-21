import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import DashboardSidebar from "./DashboardSidebar";
import { SidebarLink } from "../../../types";

interface DashboardLayoutProps {
  navbarVariant?: string;
  sidebarTitle: string;
  sidebarSubtitle: string;
  sidebarLinks: SidebarLink[];
}

const DashboardLayout = ({ navbarVariant = "default", sidebarTitle, sidebarSubtitle, sidebarLinks }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar variant={navbarVariant as "default" | "checkout" | "seller" | undefined} />
      <div className="flex flex-1">
        <DashboardSidebar
          title={sidebarTitle}
          subtitle={sidebarSubtitle}
          links={sidebarLinks}
        />
        <div className="flex-1 p-6 lg:p-8 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
