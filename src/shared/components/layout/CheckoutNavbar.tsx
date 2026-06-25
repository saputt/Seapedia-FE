import { memo } from "react";
import { useNavigate } from "react-router-dom";

const CheckoutNavbar = memo(() => {
  const navigate = useNavigate();

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
});
CheckoutNavbar.displayName = "CheckoutNavbar";

export default CheckoutNavbar;
