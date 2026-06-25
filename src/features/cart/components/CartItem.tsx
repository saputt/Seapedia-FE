import { memo } from "react";
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

interface ImageBlockProps {
  imageUrl?: string | null;
  name: string;
}

const ImageBlock = memo(({ imageUrl, name }: ImageBlockProps) => (
  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-bg-tertiary rounded flex items-center justify-center overflow-hidden shrink-0">
    {imageUrl ? (
      <img
        src={imageUrl}
        alt={name}
        loading="lazy"
        className="w-full h-full object-cover"
      />
    ) : (
      <span className="text-xs text-text-muted">No Image</span>
    )}
  </div>
));
ImageBlock.displayName = "ImageBlock";

interface DeleteButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const DeleteButton = memo(({ onClick, disabled }: DeleteButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
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
));
DeleteButton.displayName = "DeleteButton";

interface QuantityControlProps {
  quantity: number;
  isAtMax: boolean;
  busy: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
}

const QuantityControl = memo(({ quantity, isAtMax, busy, onIncrease, onDecrease }: QuantityControlProps) => (
  <div className="flex items-center gap-2">
    <button
      onClick={onDecrease}
      disabled={busy || quantity <= 1}
      className="w-8 h-8 border-[2px] border-brand-deep rounded font-bold text-lg flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400 hover:bg-brand-subtle"
    >
      &minus;
    </button>
    <span className="w-8 text-center font-semibold text-sm">
      {quantity}
    </span>
    <button
      onClick={onIncrease}
      disabled={busy || isAtMax}
      className={`w-8 h-8 border-[2px] rounded font-bold text-lg flex items-center justify-center transition-all disabled:cursor-not-allowed hover:bg-brand-subtle ${
        isAtMax
          ? "border-gray-300 text-gray-400 bg-gray-100 opacity-60"
          : "border-brand-deep text-brand-deep"
      }`}
    >
      +
    </button>
  </div>
));
QuantityControl.displayName = "QuantityControl";

interface ProductInfoProps {
  productId: string;
  name: string;
  storeName?: string;
  price: number;
}

const ProductInfo = memo(({ productId, name, storeName, price }: ProductInfoProps) => (
  <div className="flex-1 min-w-0">
    <Link
      to={`/products/${productId}`}
      className="text-sm font-semibold text-text-primary hover:text-brand-deep transition-colors line-clamp-2"
    >
      {name}
    </Link>
    <p className="text-xs text-text-muted mt-0.5">
      {storeName}
    </p>
    <p className="text-sm font-bold text-brand-deep mt-1">
      Rp{price.toLocaleString("id-ID")}
    </p>
  </div>
));
ProductInfo.displayName = "ProductInfo";

const CartItem = ({ item, busy, onUpdateQty, onRemove }: CartItemProps) => {
  const product = item.product;
  const price = product?.price ?? 0;
  const quantity = item.quantity ?? 0;
  const stock = product?.stock ?? 0;
  const isAtMax = quantity >= stock;

  const handleDecrease = () => onUpdateQty(item.productId, quantity - 1);
  const handleIncrease = () => onUpdateQty(item.productId, quantity + 1);
  const handleRemove = () => onRemove(item.productId);

  return (
    <div className="card">
      <div className="flex flex-col gap-3 sm:hidden">
        <div className="flex items-start gap-3">
          <ImageBlock imageUrl={product?.imageUrl} name={product?.name ?? ""} />
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
          <DeleteButton onClick={handleRemove} disabled={busy} />
        </div>
        <div className="flex items-center justify-between">
          <QuantityControl
            quantity={quantity}
            isAtMax={isAtMax}
            busy={busy}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
          />
          <p className="text-sm font-semibold text-text-primary">
            Rp{(price * quantity).toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-4">
        <ImageBlock imageUrl={product?.imageUrl} name={product?.name ?? ""} />
        <ProductInfo
          productId={item.productId}
          name={product?.name ?? ""}
          storeName={product?.store?.storeName}
          price={price}
        />
        <div className="flex items-center gap-2 shrink-0">
          <QuantityControl
            quantity={quantity}
            isAtMax={isAtMax}
            busy={busy}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
          />
        </div>
        <p className="text-sm font-semibold text-text-primary w-24 text-right shrink-0">
          Rp{(price * quantity).toLocaleString("id-ID")}
        </p>
        <DeleteButton onClick={handleRemove} disabled={busy} />
      </div>
    </div>
  );
};

export default memo(CartItem);
