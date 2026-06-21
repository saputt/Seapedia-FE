import { Link } from "react-router-dom";
import type { CartItem as CartItemType, Product, Store } from "../../../types";

type CartItemProduct = Product & { store?: Store & { storeName?: string } };
type CartItemWithProduct = CartItemType & { product: CartItemProduct };

interface CartItemProps {
  item: CartItemWithProduct;
  busy: boolean;
  onUpdateQty: (productId: string, newQty: number) => void;
  onRemove: (productId: string) => void;
}

const CartItem = ({ item, busy, onUpdateQty, onRemove }: CartItemProps) => {
  const product = item.product;
  const price = product?.price ?? 0;
  const quantity = item.quantity ?? 0;

  const ImageBlock = () => (
    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-bg-tertiary rounded flex items-center justify-center overflow-hidden shrink-0">
      {product?.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-xs text-text-muted">No Image</span>
      )}
    </div>
  );

  const DeleteButton = () => (
    <button
      onClick={() => onRemove(item.productId)}
      disabled={busy}
      className="text-text-muted hover:text-danger transition-colors disabled:opacity-40 shrink-0 mt-1 sm:mt-0"
      title="Hapus"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    </button>
  );

  const QuantityControl = () => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onUpdateQty(item.productId, quantity - 1)}
        disabled={busy || quantity <= 1}
        className="w-8 h-8 border-[2px] border-brand-deep rounded text-brand-deep font-bold text-lg flex items-center justify-center hover:bg-brand-subtle transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        &minus;
      </button>
      <span className="w-8 text-center font-semibold text-sm">
        {quantity}
      </span>
      <button
        onClick={() => onUpdateQty(item.productId, quantity + 1)}
        disabled={busy}
        className="w-8 h-8 border-[2px] border-brand-deep rounded text-brand-deep font-bold text-lg flex items-center justify-center hover:bg-brand-subtle transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        +
      </button>
    </div>
  );

  const ProductInfo = () => (
    <div className="flex-1 min-w-0">
      <Link
        to={`/products/${item.productId}`}
        className="text-sm font-semibold text-text-primary hover:text-brand-deep transition-colors line-clamp-2"
      >
        {product?.name}
      </Link>
      <p className="text-xs text-text-muted mt-0.5">
        {product?.store?.storeName}
      </p>
      <p className="text-sm font-bold text-brand-deep mt-1">
        Rp{price.toLocaleString("id-ID")}
      </p>
    </div>
  );

  return (
    <div className="card">
      <div className="flex flex-col gap-3 sm:hidden">
        <div className="flex items-start gap-3">
          <ImageBlock />
          <div className="flex-1 min-w-0">
            <Link
              to={`/products/${item.productId}`}
              className="text-sm font-semibold text-text-primary hover:text-brand-deep transition-colors line-clamp-2"
            >
              {product?.name}
            </Link>
            <p className="text-xs text-text-muted mt-0.5">
              {product?.store?.storeName}
            </p>
            <p className="text-sm font-bold text-brand-deep mt-1">
              Rp{price.toLocaleString("id-ID")}
            </p>
          </div>
          <DeleteButton />
        </div>
        <div className="flex items-center justify-between">
          <QuantityControl />
          <p className="text-sm font-semibold text-text-primary">
            Rp{(price * quantity).toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-4">
        <ImageBlock />
        <ProductInfo />
        <div className="flex items-center gap-2 shrink-0">
          <QuantityControl />
        </div>
        <p className="text-sm font-semibold text-text-primary w-24 text-right shrink-0">
          Rp{(price * quantity).toLocaleString("id-ID")}
        </p>
        <DeleteButton />
      </div>
    </div>
  );
};

export default CartItem;
