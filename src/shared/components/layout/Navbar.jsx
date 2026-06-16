import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../../features/auth/store/authStore";

const Navbar = () => {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const activeRole = useAuthStore((s) => s.activeRole);
  const userRoles = useAuthStore((s) => s.userRoles);
  const logout = useAuthStore((s) => s.logout);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isLoggedIn = !!token;
  const dashboardRoute = activeRole
    ? `/dashboard/${activeRole.toLowerCase()}`
    : userRoles.length > 0
      ? `/dashboard/${userRoles[0].toLowerCase()}`
      : "/";

  const displayName = user?.username || user?.email?.split("@")[0] || "User";
  const initial = displayName[0].toUpperCase();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const roleColors = {
    BUYER: "text-role-buyer",
    SELLER: "text-role-seller",
    DRIVER: "text-role-driver",
    ADMIN: "text-role-admin",
  };

  return (
    <nav className="bg-bg-primary border-b-[3px] border-brand-deep h-16 px-6 lg:px-8">
      <div className="max-w-[1280px] mx-auto h-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-brand-deep font-extrabold text-2xl tracking-tight">
            SEAPEDIA
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/products" className="text-text-secondary font-medium hover:text-brand-deep transition-colors">
              Produk
            </Link>
            <Link to="/stores" className="text-text-secondary font-medium hover:text-brand-deep transition-colors">
              Toko
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-brand-deep text-white flex items-center justify-center text-sm font-bold">
                  {initial}
                </div>
                <span className="hidden sm:inline text-sm font-medium text-text-primary">
                  {displayName}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 card !p-2 min-w-[200px] z-50">
                  <div className="px-3 py-2 border-b-[2px] border-bg-tertiary">
                    <p className="text-sm font-semibold text-text-primary truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-text-muted truncate">
                      {user?.email}
                    </p>
                  </div>

                  <Link
                    to={dashboardRoute}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-brand-deep hover:bg-brand-subtle rounded transition-colors"
                  >
                    Dashboard
                  </Link>

                  <div className="border-t-[2px] border-bg-tertiary mt-1 pt-1">
                    <button
                      onClick={() => { logout(); setDropdownOpen(false); }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-red-50 rounded transition-colors"
                    >
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/auth/login" className="btn-ghost text-sm !py-2 !px-5">
                Masuk
              </Link>
              <Link to="/auth/register" className="btn-primary text-sm !py-2 !px-5">
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
