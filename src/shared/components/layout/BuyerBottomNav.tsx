import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../../features/auth/store/authStore";
import { switchUserRole } from "../../../features/auth/api/auth.api";
import AlertModal from "../ui/AlertModal";

const BuyerBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const userRoles = useAuthStore((s) => s.userRoles);
  const logout = useAuthStore((s) => s.logout);
  const switchRole = useAuthStore((s) => s.switchRole);

  const [showAccountSheet, setShowAccountSheet] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [successModal, setSuccessModal] = useState<{ title: string; message: string; redirectTo: string } | null>(null);

  const showOnRoutes = ["/", "/orders", "/profile", "/wallet", "/addresses"];
  const isVisible = showOnRoutes.includes(location.pathname);

  const hasSeller = userRoles.includes("SELLER");
  const hasDriver = userRoles.includes("DRIVER");

  useEffect(() => {
    if (showAccountSheet) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showAccountSheet]);

  const handleSellerClick = useCallback(async () => {
    setShowAccountSheet(false);
    setSwitching(true);
    try {
      const res = await switchUserRole("SELLER");
      switchRole("SELLER", res.accessToken, res.userRoles);
      setSuccessModal({ title: "Role Berhasil Diganti", message: "Anda sekarang berada di mode Seller.", redirectTo: "/dashboard/seller" });
    } catch {
      navigate("/onboarding/seller");
    }
    setSwitching(false);
  }, [navigate, switchRole]);

  const handleDriverClick = useCallback(async () => {
    setShowAccountSheet(false);
    setSwitching(true);
    try {
      const res = await switchUserRole("DRIVER");
      switchRole("DRIVER", res.accessToken, res.userRoles);
      setSuccessModal({ title: "Role Berhasil Diganti", message: "Anda sekarang berada di mode Driver.", redirectTo: "/dashboard/driver" });
    } catch {
      navigate("/onboarding/driver");
    }
    setSwitching(false);
  }, [navigate, switchRole]);

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
          {/* Home */}
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

          {/* Order */}
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

          {/* Account */}
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

      {/* Account bottom sheet */}
      {showAccountSheet && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAccountSheet(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t-[3px] border-brand-deep rounded-t-2xl max-h-[80vh] flex flex-col">
            <div className="px-4 py-3 flex items-center justify-between border-b border-bg-tertiary shrink-0">
              <h3 className="font-bold text-text-primary">Akun Saya</h3>
              <button
                onClick={() => setShowAccountSheet(false)}
                className="p-1 hover:bg-bg-tertiary rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {/* Profile */}
              <Link
                to="/profile"
                onClick={() => setShowAccountSheet(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-brand-subtle transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-deep">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="text-sm font-medium text-text-primary">Profil Saya</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted ml-auto">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>

              {/* Wallet */}
              <Link
                to="/wallet"
                onClick={() => setShowAccountSheet(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-brand-subtle transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-deep">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                <span className="text-sm font-medium text-text-primary">Dompet</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted ml-auto">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>

              {/* Address */}
              <Link
                to="/addresses"
                onClick={() => setShowAccountSheet(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-brand-subtle transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-deep">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-sm font-medium text-text-primary">Alamat</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted ml-auto">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>

              <div className="border-t border-bg-tertiary my-1" />

              {/* Seller / Buka Toko */}
              {hasSeller ? (
                <button
                  onClick={handleSellerClick}
                  disabled={switching}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-brand-subtle transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-deep">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span className="text-sm font-medium text-text-primary">Seller</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted ml-auto">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ) : (
                <Link
                  to="/onboarding/seller"
                  onClick={() => setShowAccountSheet(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-brand-subtle transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-deep">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span className="text-sm font-medium text-brand-deep">Buka Toko</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted ml-auto">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              )}

              {/* Driver / Jadi Driver */}
              {hasDriver ? (
                <button
                  onClick={handleDriverClick}
                  disabled={switching}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-brand-subtle transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-deep">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  <span className="text-sm font-medium text-text-primary">Driver</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted ml-auto">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ) : (
                <Link
                  to="/onboarding/driver"
                  onClick={() => setShowAccountSheet(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-brand-subtle transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-deep">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  <span className="text-sm font-medium text-brand-deep">Jadi Driver</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted ml-auto">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              )}

              <div className="border-t border-bg-tertiary my-1" />

              {/* Logout */}
              <button
                onClick={() => setLogoutModal(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-danger">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span className="text-sm font-medium text-danger">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <AlertModal
        isOpen={logoutModal}
        onClose={() => setLogoutModal(false)}
        icon="👋"
        title="Yakin ingin keluar?"
        message="Anda akan logout dari akun ini."
        actionLabel="Keluar"
        onAction={handleLogout}
      />

      <AlertModal
        isOpen={!!successModal}
        onClose={() => {
          if (successModal) {
            navigate(successModal.redirectTo, { replace: true });
          }
          setSuccessModal(null);
        }}
        icon="✅"
        title={successModal?.title || ""}
        message={successModal?.message || ""}
        actionLabel="OK"
        onAction={() => {
          if (successModal) {
            navigate(successModal.redirectTo, { replace: true });
          }
          setSuccessModal(null);
        }}
      />
    </>
  );
};

export default BuyerBottomNav;
