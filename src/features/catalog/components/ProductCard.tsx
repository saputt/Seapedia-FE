import { memo } from "react";
import { VTLink as Link } from "../../../shared/utils/VTLink";
import { CATEGORY_SHORT } from "../../../shared/constants/product";
import StarRating from "../../../shared/components/ui/StarRating";
import { prefetchProductDetail } from "@/shared/utils/prefetch";
import { PLACEHOLDER_IMAGE } from "../../../shared/constants/image";
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
    <Link 
      to={`/products/${product.id}`} 
      className="card group block p-0"
      onMouseEnter={() => prefetchProductDetail(product.id)}
      onTouchStart={() => prefetchProductDetail(product.id)}
    >
      <div className="aspect-square bg-bg-tertiary flex items-center justify-center mb-3 overflow-hidden">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <img src={PLACEHOLDER_IMAGE} alt={product.name} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="p-2">
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
      </div>
    </Link>
  );
});

export default ProductCard;
