import { memo } from "react";
import { Link } from "react-router-dom";
import { CATEGORY_SHORT } from "../../../shared/constants/product";
import StarRating from "../../../shared/components/ui/StarRating";
import type { Product } from "../../../types";

interface ProductCardProduct extends Product {
  averageRating?: number;
  soldCount?: number;
}

interface ProductCardProps {
  product: ProductCardProduct;
}

const ProductCard = memo(({ product }: ProductCardProps) => {
  const price = product.price?.toLocaleString("id-ID");

  return (
    <Link to={`/products/${product.id}`} className="card group block">
      <div className="aspect-square bg-bg-tertiary flex items-center justify-center mb-3 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        )}
      </div>
      <h3 className="font-semibold text-text-primary text-sm truncate">
        {product.name}
      </h3>
      <p className="text-brand-deep font-bold text-base mt-0.5">
        Rp{price}
      </p>
      <div className="flex items-center gap-2 mt-1">
        {product.averageRating !== undefined && product.averageRating > 0 && (
          <div className="flex items-center gap-0.5">
            <StarRating value={Math.round(product.averageRating)} size="sm" readonly />
            <span className="text-xs text-text-muted">{product.averageRating}</span>
          </div>
        )}
        <span className="text-xs text-text-muted">{product.soldCount ?? 0} terjual</span>
      </div>
      {product.category && (
        <span className="inline-block mt-1.5 text-[11px] font-semibold text-brand-deep bg-brand-subtle px-1.5 py-0.5">
          {CATEGORY_SHORT[product.category] || product.category}
        </span>
      )}
    </Link>
  );
});

export default ProductCard;
