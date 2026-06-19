import { Link } from "react-router-dom";
import useCartStore from "../../../features/cart/store/cartStore";

const CartPreview = () => {
  const cartItems = useCartStore((s) => s.items);
  const badgeVisible = useCartStore((s) => s.badgeVisible);
  const hideBadge = useCartStore((s) => s.hideBadge);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const topItems = cartItems.slice(0, 5);
  const hasMore = cartItems.length > 5;

  return (
    <div className="relative group">
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

      {cartItems.length > 0 && (
        <div className="absolute right-0 top-full mt-2 card !p-2 min-w-[250px] z-50 hidden group-hover:block" onMouseEnter={() => hideBadge()}>
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
            onClick={() => hideBadge()}
            className="block text-center text-sm font-semibold text-brand-deep hover:bg-brand-subtle rounded px-3 py-2 mt-1 transition-colors"
          >
            Lihat Semua
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartPreview;
