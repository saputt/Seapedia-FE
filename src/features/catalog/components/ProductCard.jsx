import { Link } from "react-router-dom";
import { CATEGORY_LABEL } from "../../../shared/constants/product";
import StarRating from "../../../shared/components/ui/StarRating";

const ProductCard = ({ product }) => {
  const price = product.price?.toLocaleString("id-ID");

  return (
    <Link to={`/products/${product.id}`} className="card group block">
      <div className="aspect-square bg-bg-tertiary flex items-center justify-center mb-4 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-text-muted text-sm">No Image</span>
        )}
      </div>
      <h3 className="font-semibold text-text-primary text-lg truncate">
        {product.name}
      </h3>
      <p className="text-brand-deep font-bold text-xl mt-1">
        Rp{price}
      </p>
      <div className="flex items-center gap-3 mt-1">
        {product.averageRating > 0 && (
          <div className="flex items-center gap-1">
            <StarRating value={Math.round(product.averageRating)} size="sm" readonly />
            <span className="text-xs text-text-muted">{product.averageRating}</span>
          </div>
        )}
        {product.soldCount > 0 && (
          <span className="text-xs text-text-muted">{product.soldCount} terjual</span>
        )}
      </div>
      {product.category && (
        <p className="text-xs text-text-muted mt-1">
          {CATEGORY_LABEL[product.category] || product.category}
        </p>
      )}
      {product.store && (
        <p className="text-text-muted text-sm mt-1 truncate">
          {product.store.storeName}
        </p>
      )}
    </Link>
  );
};

export default ProductCard;
