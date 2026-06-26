import { memo } from "react";
import { PLACEHOLDER_IMAGE } from "../../../shared/constants/image";

interface CheckoutItem {
  productId: string;
  imageUrl?: string;
  name: string;
  price: number;
  quantity: number;
  totalItemPrice: number;
}

interface CheckoutItemsListProps {
  items: CheckoutItem[];
}

const CheckoutItemsList = memo(({ items }: CheckoutItemsListProps) => (
  <div className="card">
    <h2 className="text-sm font-bold text-text-primary mb-3">
      Produk ({items.length})
    </h2>
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.productId}
          className="flex items-center gap-3"
        >
          <div className="w-14 h-14 bg-bg-tertiary rounded flex items-center justify-center overflow-hidden shrink-0">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            ) : (
              <img src={PLACEHOLDER_IMAGE} alt={item.name} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {item.name}
            </p>
            <p className="text-xs text-text-secondary">
              Rp{item.price?.toLocaleString("id-ID")} x {item.quantity}
            </p>
          </div>
          <p className="text-sm font-semibold text-text-primary shrink-0">
            Rp{item.totalItemPrice?.toLocaleString("id-ID")}
          </p>
        </div>
      ))}
    </div>
  </div>
));
CheckoutItemsList.displayName = "CheckoutItemsList";

export default CheckoutItemsList;
