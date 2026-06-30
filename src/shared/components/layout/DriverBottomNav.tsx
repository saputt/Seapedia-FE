import { memo, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { VTLink as Link } from "../../utils/VTLink";
import useAuthStore from "../../../features/auth/store/authStore";
import AlertModal from "../ui/AlertModal";
import SwitchRoleModal from "../ui/SwitchRoleModal";
import DriverMenuSheet from "./DriverMenuSheet";
import useLockBodyScroll from "../../hooks/useLockBodyScroll";
import { useRoleSwitch } from "../../hooks/useRoleSwitch";

const driverLinks = [
  { to: "/dashboard/driver/jobs", label: "Pekerjaan Tersedia" },
  { to: "/dashboard/driver/history", label: "Riwayat" },
  { to: "/dashboard/driver/income", label: "Pemasukkan" },
  { to: "/dashboard/driver/ratings", label: "Penilaian" },
];

const DriverBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userRoles = useAuthStore((s) => s.userRoles);
  const logout = useAuthStore((s) => s.logout);

  const [showAccountSheet, setShowAccountSheet] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);

  const isVisible = location.pathname.startsWith("/dashboard/driver");

  const hasBuyer = userRoles.includes("BUYER");
  const hasSeller = userRoles.includes("SELLER");

  const { switching, switchingRole, successModal, switchToRole, closeSuccessModal } = useRoleSwitch();

  useLockBodyScroll(showAccountSheet);

  const handleBuyerClick = useCallback(() => {
    setShowAccountSheet(false);
    switchToRole("BUYER", "/");
  }, [switchToRole]);

  const handleSellerClick = useCallback(() => {
    setShowAccountSheet(false);
    switchToRole("SELLER", "/dashboard/seller");
  }, [switchToRole]);

  const handleLogout = () => {
    setLogoutModal(false);
    setShowAccountSheet(false);
    logout();
    navigate("/", { replace: true });
  };

  if (!isVisible) return null;

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-primary border-t-[3px] border-brand-deep">
        <div className="flex items-center h-16">
          <Link
            to="/dashboard/driver"
            className={`flex items-center justify-center gap-2 flex-1 h-full transition-colors ${
              location.pathname === "/dashboard/driver" ? "text-brand-deep" : "text-text-muted"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={location.pathname === "/dashboard/driver" ? "text-brand-deep" : "text-text-muted"}>
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span className={`text-[10px] font-semibold ${location.pathname === "/dashboard/driver" ? "text-brand-deep" : "text-text-muted"}`}>Dashboard</span>
          </Link>

          <button
            onClick={() => setShowAccountSheet(true)}
            className="flex items-center justify-center gap-2 flex-1 h-full transition-colors text-text-muted"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <span className="text-[10px] font-semibold text-text-muted">Menu</span>
          </button>
        </div>
      </nav>

      <DriverMenuSheet
        isOpen={showAccountSheet}
        onClose={() => setShowAccountSheet(false)}
        links={driverLinks}
        hasBuyer={hasBuyer}
        hasSeller={hasSeller}
        switching={switching}
        onBuyerClick={handleBuyerClick}
        onSellerClick={handleSellerClick}
        onLogoutClick={() => setLogoutModal(true)}
      />

      <SwitchRoleModal role={switchingRole} />

      <AlertModal
        isOpen={logoutModal}
        onClose={() => setLogoutModal(false)}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
            <path d="M7 11V7a5 5 0 0 1 10 0v4" /><path d="M21 16v2a4 4 0 0 1-4 4h-5" /><path d="M3 16v2a4 4 0 0 0 4 4h1" /><path d="M7 11v4" /><path d="M7 15h.01" />
          </svg>
        }
        title="Yakin ingin keluar?"
        message="Anda akan logout dari akun ini."
        actionLabel="Keluar"
        onAction={handleLogout}
      />

      <AlertModal
        isOpen={!!successModal}
        onClose={closeSuccessModal}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        }
        title={successModal?.title || ""}
        message={successModal?.message || ""}
        actionLabel="OK"
        onAction={closeSuccessModal}
      />
    </>
  );
};

export default memo(DriverBottomNav);
