import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "../../../features/auth/store/authStore";
import useCartStore from "../../../features/cart/store/cartStore";
import ProfileDropdown from "../ui/ProfileDropdown";
import CartPreview from "../ui/CartPreview";

interface NavbarProps {
  variant?: "default" | "checkout" | "seller";
  onMenuClick?: () => void;
}

const Navbar = ({ variant = "default", onMenuClick }: NavbarProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const token = useAuthStore((s) => s.token);
  const refreshCart = useCartStore((s) => s.refreshCart);
  const searchQuery = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(searchQuery);

  const isLoggedIn = !!token;

  useEffect(() => {
    if (isLoggedIn) refreshCart();
  }, [isLoggedIn, refreshCart]);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const currentPath = window.location.pathname;
      if (currentPath !== "/") {
        navigate(`/?q=${encodeURIComponent(searchInput)}`);
      } else {
        setSearchParams({ q: searchInput }, { replace: true });
      }
    }
  };

  if (variant === "checkout") {
    return (
      <nav className="sticky top-0 z-40 bg-bg-primary border-b-[3px] border-brand-deep h-16 px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto h-full flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-text-secondary hover:text-brand-deep transition-colors font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span className="text-lg font-bold text-text-primary">Checkout</span>
        </div>
      </nav>
    );
  }

  if (variant === "seller") {
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
  }

  return (
    <nav className="sticky top-0 z-40 bg-bg-primary border-b-[3px] border-brand-deep h-16 px-6 lg:px-8">
      <div className="max-w-[1280px] mx-auto h-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-8 shrink-0">
          <Link to="/" className="text-brand-deep font-extrabold text-2xl tracking-tight hidden sm:block">
            SEAPEDIA
          </Link>
        </div>

        {(variant as string) !== "checkout" && (variant as string) !== "seller" && (
          <div className="flex-1 sm:max-w-md sm:mx-auto">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="input-neo w-full !py-1.5 !text-sm"
              placeholder="Cari produk..."
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          {isLoggedIn && <CartPreview />}

          {isLoggedIn ? (
            <ProfileDropdown />
          ) : (
            <>
              <Link to="/auth/login" className="btn-primary text-sm !py-2 !px-5">
                Masuk
              </Link>
              <Link to="/auth/register" className="btn-ghost text-sm !py-2 !px-5 hidden sm:inline-flex">
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
