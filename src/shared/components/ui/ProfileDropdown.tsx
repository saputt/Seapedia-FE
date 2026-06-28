import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { VTLink as Link } from "../../utils/VTLink";
import useAuthStore from "../../../features/auth/store/authStore";
import { switchUserRole } from "../../../features/auth/api/auth.api";
import { getMyStore } from "../../../features/store/api/store.api";
import SwitchRoleModal from "./SwitchRoleModal";
import AlertModal from "./AlertModal";
import Avatar from "./Avatar";
import { prefetchMyStore, prefetchAdminDashboard } from "@/shared/utils/prefetch";
import type { RoleName } from "../../../types";

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const activeRole = useAuthStore((s) => s.activeRole);
  const userRoles = useAuthStore((s) => s.userRoles);
  const switchRole = useAuthStore((s) => s.switchRole);
  const logout = useAuthStore((s) => s.logout);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [switchingRole, setSwitchingRole] = useState<RoleName | null>(null);
  const [logoutModal, setLogoutModal] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const displayName = user?.username || user?.email?.split("@")[0] || "User";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (dropdownOpen) {
      if (userRoles.includes("SELLER") && activeRole !== "SELLER") {
        prefetchMyStore();
      }
      if (userRoles.includes("ADMIN") && activeRole !== "ADMIN") {
        prefetchAdminDashboard();
      }
    }
  }, [dropdownOpen, userRoles, activeRole]);

  const handleSellerClick = useCallback(async () => {
    setDropdownOpen(false);
    try {
      const store = await getMyStore();
      if (store) {
        setSwitchingRole("SELLER");
        const res = await switchUserRole("SELLER");
        switchRole("SELLER", res.accessToken, res.userRoles);
        navigate("/dashboard/seller", { replace: true });
      } else {
        navigate("/dashboard/seller/create-store");
      }
    } catch {
      navigate("/dashboard/seller/create-store");
    }
  }, [navigate, switchRole]);

  const handleBuyerClick = useCallback(() => {
    setDropdownOpen(false);
    setSwitchingRole("BUYER");
    switchUserRole("BUYER").then((res) => {
      switchRole("BUYER", res.accessToken, res.userRoles);
      navigate("/", { replace: true });
    }).catch(() => {
      setSwitchingRole(null);
    });
  }, [switchRole, navigate]);

  const handleDriverClick = useCallback(() => {
    setDropdownOpen(false);
    setSwitchingRole("DRIVER");
    switchUserRole("DRIVER").then((res) => {
      switchRole("DRIVER", res.accessToken, res.userRoles);
      navigate("/dashboard/driver", { replace: true });
    }).catch(() => {
      setSwitchingRole(null);
    });
  }, [switchRole, navigate]);

  return (
    <>
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Avatar src={user?.imageUrl} name={displayName} size="sm" />
          <span className="hidden sm:inline text-sm font-medium text-text-primary">
            {displayName}
          </span>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 card !p-2 min-w-[200px] z-50">
            <Link
                  to="/profile"
              onClick={() => setDropdownOpen(false)}
              className="block px-3 py-2 border-b-[2px] border-bg-tertiary hover:bg-brand-subtle rounded transition-colors"
            >
              <p className="text-sm font-semibold text-text-primary truncate">
                {displayName}
              </p>
              <p className="text-xs text-text-muted truncate">
                {user?.email}
              </p>
            </Link>

            {activeRole === "BUYER" && (
              <>
                <Link
                  to="/wallet"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-brand-deep hover:bg-brand-subtle rounded transition-colors"
                >
                  Wallet
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-brand-deep hover:bg-brand-subtle rounded transition-colors"
                >
                  Pesanan
                </Link>
                <Link
              to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-brand-deep hover:bg-brand-subtle rounded transition-colors"
                >
                  Profil
                </Link>
              </>
            )}

            {activeRole === "DRIVER" && (
              <>
                <Link
                  to="/dashboard/driver/jobs"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-brand-deep hover:bg-brand-subtle rounded transition-colors"
                >
                  Pekerjaan Tersedia
                </Link>
                <Link
                  to="/dashboard/driver/history"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-brand-deep hover:bg-brand-subtle rounded transition-colors"
                >
                  Riwayat
                </Link>
              </>
            )}

            <div className="border-t-[2px] border-bg-tertiary mt-1 pt-1">
              {activeRole !== "ADMIN" && activeRole === "BUYER" && !userRoles.includes("SELLER") && (
                <Link
                  to="/onboarding/seller"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-brand-deep font-medium hover:bg-brand-subtle rounded transition-colors"
                >
                  Buka Toko
                </Link>
              )}
              {activeRole !== "ADMIN" && activeRole === "BUYER" && !userRoles.includes("DRIVER") && (
                <Link
                  to="/onboarding/driver"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-brand-deep font-medium hover:bg-brand-subtle rounded transition-colors"
                >
                  Jadi Driver
                </Link>
              )}
              {activeRole !== "ADMIN" && activeRole !== "BUYER" && userRoles.includes("BUYER") && (
                <button
                  onClick={handleBuyerClick}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-brand-deep hover:bg-brand-subtle rounded transition-colors"
                >
                  Buyer
                </button>
              )}
              {activeRole !== "ADMIN" && activeRole !== "SELLER" && userRoles.includes("SELLER") && (
                <button
                  onClick={handleSellerClick}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-brand-deep hover:bg-brand-subtle rounded transition-colors"
                >
                  Seller
                </button>
              )}
              {activeRole !== "ADMIN" && activeRole !== "DRIVER" && userRoles.includes("DRIVER") && (
                <button
                  onClick={handleDriverClick}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-brand-deep hover:bg-brand-subtle rounded transition-colors"
                >
                  Driver
                </button>
              )}
              <button
                onClick={() => { setDropdownOpen(false); setLogoutModal(true); }}
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-red-50 rounded transition-colors"
              >
                Keluar
              </button>
            </div>
          </div>
        )}
      </div>
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
        onAction={() => {
          logout();
          navigate("/about", { replace: true });
        }}
      />
    </>
  );
};

export default ProfileDropdown;
