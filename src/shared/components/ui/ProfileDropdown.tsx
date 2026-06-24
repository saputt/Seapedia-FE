import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../../features/auth/store/authStore";
import { switchUserRole } from "../../../features/auth/api/auth.api";
import { getMyStore } from "../../../features/store/api/store.api";
import SwitchRoleModal from "./SwitchRoleModal";
import AlertModal from "./AlertModal";
import Avatar from "./Avatar";
import type { RoleName } from "../../../types";

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const activeRole = useAuthStore((s) => s.activeRole);
  const userRoles = useAuthStore((s) => s.userRoles);
  const logout = useAuthStore((s) => s.logout);
  const switchRole = useAuthStore((s) => s.switchRole);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [switchingRole, setSwitchingRole] = useState<RoleName | null>(null);
  const [logoutModal, setLogoutModal] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const displayName = user?.username || user?.email?.split("@")[0] || "User";
  const initial = displayName[0].toUpperCase();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSellerClick = useCallback(async () => {
    setDropdownOpen(false);
    try {
      const store = await getMyStore();
      if (store) {
        setSwitchingRole("SELLER");
        const res = await switchUserRole("SELLER");
        switchRole("SELLER", res.accessToken, res.userRoles);
        setSwitchingRole(null);
        navigate("/dashboard/seller", { replace: true });
      } else {
        navigate("/dashboard/seller/create-store");
      }
    } catch {
      navigate("/dashboard/seller/create-store");
    }
  }, [navigate, switchRole]);

  const handleBuyerClick = useCallback(async () => {
    setDropdownOpen(false);
    setSwitchingRole("BUYER");
    try {
      const res = await switchUserRole("BUYER");
      switchRole("BUYER", res.accessToken, res.userRoles);
      setSwitchingRole(null);
      navigate("/", { replace: true });
    } catch {
      setSwitchingRole(null);
    }
  }, [navigate, switchRole]);

  const handleDriverClick = useCallback(async () => {
    setDropdownOpen(false);
    setSwitchingRole("DRIVER");
    try {
      const res = await switchUserRole("DRIVER");
      switchRole("DRIVER", res.accessToken, res.userRoles);
      setSwitchingRole(null);
      navigate("/dashboard/driver", { replace: true });
    } catch {
      setSwitchingRole(null);
    }
  }, [navigate, switchRole]);

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
              {activeRole === "BUYER" && !userRoles.includes("SELLER") && (
                <Link
                  to="/onboarding/seller"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-brand-deep font-medium hover:bg-brand-subtle rounded transition-colors"
                >
                  Buka Toko
                </Link>
              )}
              {activeRole === "BUYER" && !userRoles.includes("DRIVER") && (
                <Link
                  to="/onboarding/driver"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-brand-deep font-medium hover:bg-brand-subtle rounded transition-colors"
                >
                  Jadi Driver
                </Link>
              )}
              {activeRole !== "BUYER" && userRoles.includes("BUYER") && (
                <button
                  onClick={handleBuyerClick}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-brand-deep hover:bg-brand-subtle rounded transition-colors"
                >
                  Buyer
                </button>
              )}
              {activeRole !== "SELLER" && userRoles.includes("SELLER") && (
                <button
                  onClick={handleSellerClick}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-brand-deep hover:bg-brand-subtle rounded transition-colors"
                >
                  Seller
                </button>
              )}
              {activeRole !== "DRIVER" && userRoles.includes("DRIVER") && (
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
        icon="👋"
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
