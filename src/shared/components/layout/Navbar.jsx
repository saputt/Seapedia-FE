import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../../features/auth/store/authStore";
import useCartStore from "../../../features/cart/store/cartStore";
import { switchUserRole } from "../../../features/auth/api/auth.api";
import { getMyStore } from "../../../features/store/api/store.api";
import SwitchRoleModal from "./../ui/SwitchRoleModal";

const Navbar = ({ variant = "default" }) => {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const activeRole = useAuthStore((s) => s.activeRole);
  const userRoles = useAuthStore((s) => s.userRoles);
  const logout = useAuthStore((s) => s.logout);

  const cartItems = useCartStore((s) => s.items);
  const badgeVisible = useCartStore((s) => s.badgeVisible);
  const hideBadge = useCartStore((s) => s.hideBadge);
  const refreshCart = useCartStore((s) => s.refreshCart);

  const switchRole = useAuthStore((s) => s.switchRole);

  const isLoggedIn = !!token;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartHover, setCartHover] = useState(false);
  const [switchingRole, setSwitchingRole] = useState(null);
  const profileRef = useRef(null);
  const cartRef = useRef(null);

  const handleSellerClick = useCallback(async () => {
    setDropdownOpen(false);
    try {
      const store = await getMyStore();
      if (store) {
        setSwitchingRole("SELLER");
        const res = await switchUserRole("SELLER");
        switchRole("SELLER", res.accessToken);
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
      switchRole("BUYER", res.accessToken);
      setSwitchingRole(null);
      navigate("/products", { replace: true });
    } catch {
      setSwitchingRole(null);
    }
  }, [navigate, switchRole]);

  const handleDriverClick = useCallback(async () => {
    setDropdownOpen(false);
    setSwitchingRole("DRIVER");
    try {
      const res = await switchUserRole("DRIVER");
      switchRole("DRIVER", res.accessToken);
      setSwitchingRole(null);
      navigate("/dashboard/driver", { replace: true });
    } catch {
      setSwitchingRole(null);
    }
  }, [navigate, switchRole]);

  useEffect(() => {
    if (isLoggedIn) refreshCart();
  }, [isLoggedIn]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setCartHover(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user?.username || user?.email?.split("@")[0] || "User";
  const initial = displayName[0].toUpperCase();

  if (variant === "checkout") {
    return (
      <nav className="bg-bg-primary border-b-[3px] border-brand-deep h-16 px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto h-full flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-text-secondary hover:text-brand-deep transition-colors font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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
      <>
      <nav className="bg-bg-primary border-b-[3px] border-brand-deep h-16 px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto h-full flex items-center justify-between">
          <Link className="text-brand-deep font-extrabold text-2xl tracking-tight">
            SEAPEDIA
          </Link>
          <div className="flex items-center gap-3">
            {isLoggedIn && (
              <div className="relative" ref={profileRef}>
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

                    {activeRole !== "BUYER" && (
                      <button
                        onClick={handleBuyerClick}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-brand-deep hover:bg-brand-subtle rounded transition-colors"
                      >
                        Buyer
                      </button>
                    )}
                    {activeRole !== "SELLER" && (
                      <button
                        onClick={handleSellerClick}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-brand-deep hover:bg-brand-subtle rounded transition-colors"
                      >
                        Seller
                      </button>
                    )}
                    {activeRole !== "DRIVER" && (
                      <button
                        onClick={handleDriverClick}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-brand-deep hover:bg-brand-subtle rounded transition-colors"
                      >
                        Driver
                      </button>
                    )}

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
            )}
          </div>
        </div>
      </nav>
        <SwitchRoleModal role={switchingRole} />
      </>
    );
  }

  const dashboardRoute = activeRole
    ? `/dashboard/${activeRole.toLowerCase()}`
    : userRoles.length > 0
      ? `/dashboard/${userRoles[0].toLowerCase()}`
      : "/";

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const topItems = cartItems.slice(0, 5);
  const hasMore = cartItems.length > 5;

  return (
    <>
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
          {isLoggedIn && (
            <div
              className="relative"
              ref={cartRef}
              onMouseEnter={() => { setCartHover(true); hideBadge(); }}
              onMouseLeave={() => setCartHover(false)}
            >
              <Link
                to="/cart"
                onClick={() => hideBadge()}
                className="relative flex items-center justify-center w-9 h-9 hover:bg-brand-subtle rounded-lg transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-text-secondary"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>

                {badgeVisible && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-danger text-white text-[10px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>

              {cartHover && cartItems.length > 0 && (
                <div className="absolute right-0 top-full mt-2 card !p-2 min-w-[250px] z-50">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wide px-3 py-1">
                    Keranjang ({totalItems})
                  </p>
                  <div className="max-h-[280px] overflow-y-auto">
                    {topItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-brand-subtle rounded transition-colors"
                      >
                        <div className="w-10 h-10 bg-bg-tertiary rounded flex items-center justify-center overflow-hidden shrink-0">
                          {item.product?.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs text-text-muted">Img</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">
                            {item.product?.name}
                          </p>
                          <p className="text-xs text-text-secondary">
                            Rp{item.product?.price?.toLocaleString("id-ID")} x{item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                    {hasMore && (
                      <p className="text-xs text-text-muted text-center py-1">
                        ...dan {cartItems.length - 5} lainnya
                      </p>
                    )}
                  </div>
                  <Link
                    to="/cart"
                    onClick={() => setCartHover(false)}
                    className="block text-center text-sm font-semibold text-brand-deep hover:bg-brand-subtle rounded px-3 py-2 mt-1 transition-colors"
                  >
                    Lihat Semua
                  </Link>
                </div>
              )}
            </div>
          )}

          {isLoggedIn ? (
            <div className="relative" ref={profileRef}>
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

                  {activeRole === "BUYER" && (
                    <>
                      <Link
                        to="/dashboard/buyer/wallet"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-brand-deep hover:bg-brand-subtle rounded transition-colors"
                      >
                        Wallet
                      </Link>
                      <Link
                        to="/dashboard/buyer/orders"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-brand-deep hover:bg-brand-subtle rounded transition-colors"
                      >
                        Pesanan
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

                  {activeRole !== "BUYER" && (
                    <button
                      onClick={handleBuyerClick}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-brand-deep hover:bg-brand-subtle rounded transition-colors"
                    >
                      Buyer
                    </button>
                  )}
                  {activeRole !== "SELLER" && (
                    <button
                      onClick={handleSellerClick}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-brand-deep hover:bg-brand-subtle rounded transition-colors"
                    >
                      Seller
                    </button>
                  )}
                  {activeRole !== "DRIVER" && (
                    <button
                      onClick={handleDriverClick}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-brand-deep hover:bg-brand-subtle rounded transition-colors"
                    >
                      Driver
                    </button>
                  )}

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
      <SwitchRoleModal role={switchingRole} />
    </>
  );
};

export default Navbar;
