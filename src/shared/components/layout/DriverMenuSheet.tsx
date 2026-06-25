import { memo } from "react";
import { Link, useLocation } from "react-router-dom";

interface DriverLink {
  to: string;
  label: string;
}

interface DriverMenuSheetProps {
  isOpen: boolean;
  onClose: () => void;
  links: DriverLink[];
  hasBuyer: boolean;
  hasSeller: boolean;
  switching: boolean;
  onBuyerClick: () => void;
  onSellerClick: () => void;
  onLogoutClick: () => void;
}

const DriverMenuSheet = memo(({
  isOpen,
  onClose,
  links,
  hasBuyer,
  hasSeller,
  switching,
  onBuyerClick,
  onSellerClick,
  onLogoutClick,
}: DriverMenuSheetProps) => {
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t-[3px] border-brand-deep rounded-t-2xl max-h-[85vh] flex flex-col">
        <div className="px-4 py-3 flex items-center justify-between border-b border-bg-tertiary shrink-0">
          <h3 className="font-bold text-text-primary">Menu</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-bg-tertiary rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === link.to ? "bg-brand-subtle" : "hover:bg-brand-subtle"
              }`}
            >
              <span className={`text-sm font-medium ${location.pathname === link.to ? "text-brand-deep" : "text-text-primary"}`}>{link.label}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted ml-auto">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ))}

          <div className="border-t border-bg-tertiary my-1" />

          {hasBuyer && (
            <button
              onClick={onBuyerClick}
              disabled={switching}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-brand-subtle transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-deep">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span className="text-sm font-medium text-text-primary">Buyer</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted ml-auto">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}

          {hasSeller && (
            <button
              onClick={onSellerClick}
              disabled={switching}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-brand-subtle transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-deep">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span className="text-sm font-medium text-text-primary">Seller</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted ml-auto">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}

          <div className="border-t border-bg-tertiary my-1" />

          <button
            onClick={onLogoutClick}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-danger">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="text-sm font-medium text-danger">Keluar</span>
          </button>
        </div>
      </div>
    </div>
  );
});
DriverMenuSheet.displayName = "DriverMenuSheet";

export default DriverMenuSheet;
