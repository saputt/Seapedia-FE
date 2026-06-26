import { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { VTLink as Link } from "../../utils/VTLink";
import useAuthStore from "../../../features/auth/store/authStore";
import AlertModal from "../ui/AlertModal";
import SwitchRoleModal from "../ui/SwitchRoleModal";
import AccountBottomSheet from "./AccountBottomSheet";
import useLockBodyScroll from "../../hooks/useLockBodyScroll";
import { useRoleSwitch } from "../../hooks/useRoleSwitch";

const BuyerBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userRoles = useAuthStore((s) => s.userRoles);
  const logout = useAuthStore((s) => s.logout);

  const [showAccountSheet, setShowAccountSheet] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);

  const showOnRoutes = ["/", "/orders", "/profile", "/wallet", "/addresses"];
  const isVisible = showOnRoutes.includes(location.pathname);

  const hasSeller = userRoles.includes("SELLER");
  const hasDriver = userRoles.includes("DRIVER");

  const { switching, switchingRole, successModal, switchToRole, closeSuccessModal } = useRoleSwitch({
    onError: (role) => {
      navigate(`/onboarding/${role.toLowerCase()}`);
    },
  });

  useLockBodyScroll(showAccountSheet);

  const handleSellerClick = useCallback(() => {
    setShowAccountSheet(false);
    switchToRole("SELLER", "/dashboard/seller");
  }, [switchToRole]);

  const handleDriverClick = useCallback(() => {
    setShowAccountSheet(false);
    switchToRole("DRIVER", "/dashboard/driver");
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-primary border-t-[3px] border-brand-deep">
        <div className="flex items-center justify-around h-16">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
              location.pathname === "/" ? "text-brand-deep" : "text-text-muted"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={location.pathname === "/" ? "text-brand-deep" : "text-text-muted"}>
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className={`text-[10px] font-semibold ${location.pathname === "/" ? "text-brand-deep" : "text-text-muted"}`}>Home</span>
          </Link>

          <Link
            to="/orders"
            className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
              location.pathname === "/orders" ? "text-brand-deep" : "text-text-muted"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={location.pathname === "/orders" ? "text-brand-deep" : "text-text-muted"}>
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className={`text-[10px] font-semibold ${location.pathname === "/orders" ? "text-brand-deep" : "text-text-muted"}`}>Order</span>
          </Link>

          <button
            onClick={() => setShowAccountSheet(true)}
            className="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors text-text-muted"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="text-[10px] font-semibold text-text-muted">Akun</span>
          </button>
        </div>
      </nav>

      <AccountBottomSheet
        isOpen={showAccountSheet}
        onClose={() => setShowAccountSheet(false)}
        hasSeller={hasSeller}
        hasDriver={hasDriver}
        switching={switching}
        onSellerClick={handleSellerClick}
        onDriverClick={handleDriverClick}
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

export default BuyerBottomNav;
