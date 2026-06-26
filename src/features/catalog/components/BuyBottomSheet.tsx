import React from "react";
import QuantitySelector from "./QuantitySelector";
import useLockBodyScroll from "../../../shared/hooks/useLockBodyScroll";
import { PLACEHOLDER_IMAGE } from "../../../shared/constants/image";

interface BuyBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    price: number;
    imageUrl?: string;
    stock: number;
  } | null;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onBuyNow: () => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
}

const BuyBottomSheet: React.FC<BuyBottomSheetProps> = ({
  isOpen,
  onClose,
  product,
  quantity,
  onQuantityChange,
  onBuyNow,
  isLoggedIn,
  onLoginClick,
}) => {
  useLockBodyScroll(isOpen);

  if (!isOpen || !product) return null;

  const subtotal = product.price * quantity;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t-[3px] border-brand-deep rounded-t-2xl max-h-[70vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-bg-tertiary">
          <h3 className="font-bold text-text-primary">Beli Sekarang</h3>
          <button onClick={onClose} className="p-1 hover:bg-bg-tertiary rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex gap-3 mb-4">
            <div className="w-16 h-16 bg-bg-tertiary rounded-lg overflow-hidden shrink-0 border-[2px] border-bg-tertiary">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <img src={PLACEHOLDER_IMAGE} alt={product.name} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">{product.name}</p>
              <p className="text-sm font-bold text-brand-deep mt-1">Rp{product.price?.toLocaleString("id-ID")}</p>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-bg-tertiary">
            <span className="text-sm text-text-secondary">Jumlah</span>
            <QuantitySelector
              quantity={quantity}
              stock={product.stock}
              onIncrease={() => onQuantityChange(Math.min(product.stock, quantity + 1))}
              onDecrease={() => onQuantityChange(Math.max(1, quantity - 1))}
            />
          </div>

          <div className="flex items-center justify-between py-3 border-t border-bg-tertiary">
            <span className="text-sm font-semibold text-text-primary">Subtotal</span>
            <span className="text-lg font-bold text-brand-deep">Rp{subtotal.toLocaleString("id-ID")}</span>
          </div>
        </div>

        <div className="p-4 border-t border-bg-tertiary">
          {isLoggedIn ? (
            <button
              onClick={onBuyNow}
              disabled={product.stock < 1 || quantity < 1}
              className="w-full h-12 bg-brand-deep text-white border-[3px] border-brand-deep shadow-[4px_4px_0_0_var(--color-brand-deep)] font-bold text-base rounded-lg hover:bg-brand-mid transition-all active:shadow-[2px_2px_0_0_var(--color-brand-deep)] active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Beli Sekarang
            </button>
          ) : (
            <button
              onClick={onLoginClick}
              className="w-full h-12 bg-brand-deep text-white border-[3px] border-brand-deep shadow-[4px_4px_0_0_var(--color-brand-deep)] font-bold text-base rounded-lg hover:bg-brand-mid transition-all active:shadow-[2px_2px_0_0_var(--color-brand-deep)] active:translate-x-[2px] active:translate-y-[2px]"
            >
              Login untuk Beli
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyBottomSheet;
