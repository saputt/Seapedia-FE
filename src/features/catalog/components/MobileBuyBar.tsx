interface MobileBuyBarProps {
  isLoggedIn: boolean;
  stock: number;
  quantity: number;
  addPending: boolean;
  clearPending: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onLoginClick: () => void;
}

const MobileBuyBar = ({ isLoggedIn, stock, quantity, addPending, clearPending, onAddToCart, onBuyNow, onLoginClick }: MobileBuyBarProps) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t-[3px] border-brand-deep p-3 md:hidden z-50">
    <div className="flex items-center gap-3">
      {isLoggedIn ? (
        <button
          onClick={onAddToCart}
          disabled={stock < 1 || quantity < 1 || addPending}
          className="flex items-center justify-center w-12 h-12 border-[3px] border-brand-deep rounded-lg hover:bg-brand-subtle transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {addPending ? (
            <span className="w-5 h-5 border-[2px] border-brand-deep border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-deep">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          )}
        </button>
      ) : (
        <button
          onClick={onLoginClick}
          className="flex items-center justify-center w-12 h-12 border-[3px] border-brand-deep rounded-lg hover:bg-brand-subtle transition-colors shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-deep">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </button>
      )}
      <button
        onClick={onBuyNow}
        disabled={!isLoggedIn || stock < 1 || quantity < 1 || clearPending}
        className="flex-1 h-12 bg-brand-deep text-white border-[3px] border-brand-deep shadow-[4px_4px_0_0_var(--color-brand-deep)] font-bold text-base rounded-lg hover:bg-brand-mid transition-all active:shadow-[2px_2px_0_0_var(--color-brand-deep)] active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {clearPending ? (
          <span className="w-5 h-5 border-[2px] border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          "Beli Sekarang"
        )}
      </button>
    </div>
  </div>
);

export default MobileBuyBar;
