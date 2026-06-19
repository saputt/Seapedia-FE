import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "../../../features/auth/store/authStore";
import useCartStore from "../../../features/cart/store/cartStore";
import ProfileDropdown from "../ui/ProfileDropdown";
import CartPreview from "../ui/CartPreview";

const Navbar = ({ variant = "default" }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const token = useAuthStore((s) => s.token);
  const refreshCart = useCartStore((s) => s.refreshCart);
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");

  const isLoggedIn = !!token;

  useEffect(() => {
    if (isLoggedIn) refreshCart();
  }, [isLoggedIn, refreshCart]);

  useEffect(() => {
    setSearchInput(searchParams.get("q") || "");
  }, [searchParams.get("q")]);

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      setSearchParams({ q: searchInput }, { replace: true });
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
          <Link className="text-brand-deep font-extrabold text-2xl tracking-tight">
            SEAPEDIA
          </Link>
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
          <Link to="/" className="text-brand-deep font-extrabold text-2xl tracking-tight">
            SEAPEDIA
          </Link>
        </div>

        {variant !== "checkout" && variant !== "seller" && (
          <div className="flex-1 max-w-md mx-auto">
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
