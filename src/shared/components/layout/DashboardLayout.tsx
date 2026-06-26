import { useState, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import DashboardSidebar from "./DashboardSidebar";
import BottomTabBar from "./BottomTabBar";
import MobileSidebar from "./MobileSidebar";
import SellerBottomNav from "./SellerBottomNav";
import DriverBottomNav from "./DriverBottomNav";
import AdminBottomNav from "./AdminBottomNav";
import { SidebarLink } from "../../../types";
import { useAvailableJobs } from "../../../features/driver/hooks/useDriverJobs";

interface DashboardLayoutProps {
  navbarVariant?: string;
  sidebarTitle: string;
  sidebarSubtitle: string;
  sidebarLinks: SidebarLink[];
  mobileNav?: "bottom-tabs" | "hamburger";
}

const DashboardLayout = ({ navbarVariant = "default", sidebarTitle, sidebarSubtitle, sidebarLinks, mobileNav }: DashboardLayoutProps) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const isDriver = location.pathname.startsWith("/dashboard/driver");
  const { data: availableJobs } = useAvailableJobs({ enabled: isDriver });
  const availableCount = isDriver ? (availableJobs?.length ?? 0) : 0;

  const handleOpenMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(true);
  }, []);

  const handleCloseMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  const badgeCounts: Record<string, number> = isDriver
    ? { "/dashboard/driver/jobs": availableCount }
    : {};

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
        <div className={`flex-1 p-3 lg:p-8 overflow-auto ${mobileNav === "bottom-tabs" || mobileNav === "hamburger" ? "pb-24 lg:pb-8" : ""}`}>
          <Outlet />
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileNav === "bottom-tabs" && <BottomTabBar links={sidebarLinks} badgeCounts={badgeCounts} />}
      {mobileNav === "hamburger" && (
        <MobileSidebar
          isOpen={isMobileSidebarOpen}
          onClose={handleCloseMobileSidebar}
          title={sidebarTitle}
          subtitle={sidebarSubtitle}
          links={sidebarLinks}
        />
      )}
      <SellerBottomNav />
      <DriverBottomNav />
      <AdminBottomNav />
    </div>
  );
};

export default DashboardLayout;
