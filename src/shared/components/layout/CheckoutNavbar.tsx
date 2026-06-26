import { memo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCheckoutOrigin } from "../../utils/backNavigation";
import AlertModal from "../ui/AlertModal";

const CheckoutNavbar = memo(() => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showConfirm, setShowConfirm] = useState(false);

  const getBackTarget = () => {
    const origin = getCheckoutOrigin();
    if (origin) return origin;
    const isDirectBuy = searchParams.get("buyNow") === "1";
    const productId = searchParams.get("productId");
    if (isDirectBuy && productId) return `/products/${productId}`;
    return "/cart";
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-bg-primary border-b-[3px] border-brand-deep h-16 px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto h-full flex items-center gap-4">
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-1 text-text-secondary hover:text-brand-deep transition-colors font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span className="text-lg font-bold text-text-primary">Checkout</span>
        </div>
      </nav>
      <AlertModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        }
        title="Batalkan Pesanan?"
        message="Pesanan yang sedang diisi akan hilang jika Anda keluar dari halaman ini."
        actionLabel="Ya, Keluar"
        onAction={() => { setShowConfirm(false); navigate(getBackTarget()); }}
      />
    </>
  );
});
CheckoutNavbar.displayName = "CheckoutNavbar";

export default CheckoutNavbar;
