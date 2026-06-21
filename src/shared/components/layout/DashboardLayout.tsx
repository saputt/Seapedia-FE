import { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import DashboardSidebar from "./DashboardSidebar";
import BottomTabBar from "./BottomTabBar";
import MobileSidebar from "./MobileSidebar";
import { SidebarLink } from "../../../types";

interface DashboardLayoutProps {
  navbarVariant?: string;
  sidebarTitle: string;
  sidebarSubtitle: string;
  sidebarLinks: SidebarLink[];
  mobileNav?: "bottom-tabs" | "hamburger";
}

const DashboardLayout = ({ navbarVariant = "default", sidebarTitle, sidebarSubtitle, sidebarLinks, mobileNav }: DashboardLayoutProps) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleOpenMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(true);
  }, []);

  const handleCloseMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar
        variant={navbarVariant as "default" | "checkout" | "seller" | undefined}
        onMenuClick={mobileNav === "hamburger" ? handleOpenMobileSidebar : undefined}
      />
      <div className="flex flex-1">
        <DashboardSidebar
          title={sidebarTitle}
          subtitle={sidebarSubtitle}
          links={sidebarLinks}
        />
        <div className={`flex-1 p-6 lg:p-8 overflow-auto ${mobileNav === "bottom-tabs" ? "pb-24 lg:pb-8" : ""}`}>
          <Outlet />
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileNav === "bottom-tabs" && <BottomTabBar links={sidebarLinks} />}
      {mobileNav === "hamburger" && (
        <MobileSidebar
          isOpen={isMobileSidebarOpen}
          onClose={handleCloseMobileSidebar}
          title={sidebarTitle}
          subtitle={sidebarSubtitle}
          links={sidebarLinks}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
