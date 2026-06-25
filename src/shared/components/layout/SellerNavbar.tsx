import { memo } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../../features/auth/store/authStore";
import ProfileDropdown from "../ui/ProfileDropdown";

interface SellerNavbarProps {
  onMenuClick?: () => void;
}

const SellerNavbar = memo(({ onMenuClick }: SellerNavbarProps) => {
  const token = useAuthStore((s) => s.token);
  const isLoggedIn = !!token;

  return (
    <nav className="sticky top-0 z-40 bg-bg-primary border-b-[3px] border-brand-deep h-16 px-6 lg:px-8">
      <div className="max-w-[1280px] mx-auto h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 -ml-2 hover:bg-brand-subtle rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-primary">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          )}
          <Link to="/" className="text-brand-deep font-extrabold text-2xl tracking-tight">
            SEAPEDIA
          </Link>
        </div>
        <div className="flex items-center gap-3">
          {isLoggedIn && <ProfileDropdown />}
        </div>
      </div>
    </nav>
  );
});
SellerNavbar.displayName = "SellerNavbar";

export default SellerNavbar;
