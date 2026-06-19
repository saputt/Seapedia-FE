import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import DashboardSidebar from "./DashboardSidebar";

const DashboardLayout = ({ navbarVariant = "default", sidebarTitle, sidebarSubtitle, sidebarLinks }) => {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar variant={navbarVariant} />
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