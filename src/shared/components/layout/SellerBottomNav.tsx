import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../../features/auth/store/authStore";
import { switchUserRole } from "../../../features/auth/api/auth.api";
import AlertModal from "../ui/AlertModal";

const sellerLinks = [
  { to: "/dashboard/seller/manage-store", label: "Manajemen Toko" },
  { to: "/dashboard/seller/products", label: "Produk" },
  { to: "/dashboard/seller/ratings", label: "Penilaian" },
  { to: "/dashboard/seller/orders", label: "Pesanan" },
  { to: "/dashboard/seller/income", label: "Pemasukkan" },
];

const SellerBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userRoles = useAuthStore((s) => s.userRoles);
  const logout = useAuthStore((s) => s.logout);
  const switchRole = useAuthStore((s) => s.switchRole);

  const [showAccountSheet, setShowAccountSheet] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [successModal, setSuccessModal] = useState<{ title: string; message: string; redirectTo: string } | null>(null);

  const isVisible = location.pathname.startsWith("/dashboard/seller");

  const hasBuyer = userRoles.includes("BUYER");
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

  const handleBuyerClick = useCallback(async () => {
    setShowAccountSheet(false);
    setSwitching(true);
    try {
      const res = await switchUserRole("BUYER");
      switchRole("BUYER", res.accessToken, res.userRoles);
      setSuccessModal({ title: "Role Berhasil Diganti", message: "Anda sekarang berada di mode Buyer.", redirectTo: "/" });
    } catch {
      setSwitching(false);
    }
  }, [switchRole]);

  const handleDriverClick = useCallback(async () => {
    setShowAccountSheet(false);
    setSwitching(true);
    try {
      const res = await switchUserRole("DRIVER");
      switchRole("DRIVER", res.accessToken, res.userRoles);
      setSuccessModal({ title: "Role Berhasil Diganti", message: "Anda sekarang berada di mode Driver.", redirectTo: "/dashboard/driver" });
    } catch {
      setSwitching(false);
    }
  }, [switchRole]);

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
          {/* Dashboard */}
          <Link
            to="/dashboard/seller"
            className={`flex items-center justify-center gap-2 flex-1 h-full transition-colors ${
              location.pathname === "/dashboard/seller" ? "text-brand-deep" : "text-text-muted"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={location.pathname === "/dashboard/seller" ? "text-brand-deep" : "text-text-muted"}>
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span className={`text-[10px] font-semibold ${location.pathname === "/dashboard/seller" ? "text-brand-deep" : "text-text-muted"}`}>Dashboard</span>
          </Link>

          {/* Menu (all seller features) */}
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

      {/* Menu bottom sheet */}
      {showAccountSheet && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAccountSheet(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t-[3px] border-brand-deep rounded-t-2xl max-h-[85vh] flex flex-col">
            <div className="px-4 py-3 flex items-center justify-between border-b border-bg-tertiary shrink-0">
              <h3 className="font-bold text-text-primary">Menu</h3>
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
              {/* Seller features */}
              {sellerLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setShowAccountSheet(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === link.to ? "bg-brand-subtle" : "hover:bg-brand-subtle"
                  }`}
                >
                  <span className={`text-sm font-medium ${location.pathname === link.to ? "text-brand-deep" : "text-text-primary"}`}>{link.label}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted ml-auto">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              ))}

              <div className="border-t border-bg-tertiary my-1" />

              <div className="border-t border-bg-tertiary my-1" />

              {/* Switch to Buyer */}
              {hasBuyer && (
                <button
                  onClick={handleBuyerClick}
                  disabled={switching}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-brand-subtle transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-deep">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  <span className="text-sm font-medium text-text-primary">Buyer</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted ml-auto">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              )}

              {/* Switch to Driver */}
              {hasDriver && (
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

export default SellerBottomNav;
