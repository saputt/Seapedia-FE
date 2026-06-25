import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../../features/auth/store/authStore";
import AlertModal from "../ui/AlertModal";
import useLockBodyScroll from "../../hooks/useLockBodyScroll";

const adminLinks = [
  { to: "/dashboard/admin/users", label: "Pengguna" },
  { to: "/dashboard/admin/stores", label: "Toko" },
  { to: "/dashboard/admin/drivers", label: "Driver" },
  { to: "/dashboard/admin/products", label: "Produk" },
  { to: "/dashboard/admin/orders", label: "Pesanan" },
  { to: "/dashboard/admin/discounts", label: "Diskon" },
  { to: "/dashboard/admin/simulate", label: "Simulasi" },
];

const AdminBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const [showMenuSheet, setShowMenuSheet] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);

  const isVisible = location.pathname.startsWith("/dashboard/admin");

  useLockBodyScroll(showMenuSheet);

  const handleLogout = () => {
    setLogoutModal(false);
    setShowMenuSheet(false);
    logout();
    navigate("/", { replace: true });
  };

  if (!isVisible) return null;

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-primary border-t-[3px] border-brand-deep">
        <div className="flex items-center h-16">
          <Link
            to="/dashboard/admin"
            className={`flex items-center justify-center gap-2 flex-1 h-full transition-colors ${
              location.pathname === "/dashboard/admin" ? "text-brand-deep" : "text-text-muted"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={location.pathname === "/dashboard/admin" ? "text-brand-deep" : "text-text-muted"}>
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span className={`text-[10px] font-semibold ${location.pathname === "/dashboard/admin" ? "text-brand-deep" : "text-text-muted"}`}>Dashboard</span>
          </Link>

          <button
            onClick={() => setShowMenuSheet(true)}
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

      {showMenuSheet && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMenuSheet(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t-[3px] border-brand-deep rounded-t-2xl max-h-[85vh] flex flex-col">
            <div className="px-4 py-3 flex items-center justify-between border-b border-bg-tertiary shrink-0">
              <h3 className="font-bold text-text-primary">Menu Admin</h3>
              <button
                onClick={() => setShowMenuSheet(false)}
                className="p-1 hover:bg-bg-tertiary rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {adminLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setShowMenuSheet(false)}
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
    </>
  );
};

export default AdminBottomNav;
