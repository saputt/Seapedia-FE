import { Link } from "react-router-dom";
import useAuthStore from "../../../features/auth/store/authStore";

const Navbar = () => {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const activeRole = useAuthStore((s) => s.activeRole);
  const userRoles = useAuthStore((s) => s.userRoles);
  const logout = useAuthStore((s) => s.logout);

  const isLoggedIn = !!token;
  const dashboardRoute = activeRole
    ? `/dashboard/${activeRole.toLowerCase()}`
    : userRoles.length > 0
      ? `/dashboard/${userRoles[0].toLowerCase()}`
      : "/";
  const initial = user?.email ? user.email[0].toUpperCase() : "?";

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
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to={dashboardRoute}
                  className="w-9 h-9 rounded-full bg-brand-deep text-white flex items-center justify-center text-sm font-bold hover:bg-brand-mid transition-colors"
                >
                  {initial}
                </Link>
                <Link
                  to={dashboardRoute}
                  className="text-sm text-text-secondary hover:text-brand-deep font-medium transition-colors truncate max-w-[120px]"
                >
                  {user?.email}
                </Link>
              </div>
              <Link
                to={dashboardRoute}
                className="w-9 h-9 rounded-full bg-brand-deep text-white flex items-center justify-center text-sm font-bold hover:bg-brand-mid transition-colors sm:hidden"
              >
                {initial}
              </Link>
              <button
                onClick={logout}
                className="btn-ghost text-sm !py-2 !px-4"
              >
                Keluar
              </button>
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
