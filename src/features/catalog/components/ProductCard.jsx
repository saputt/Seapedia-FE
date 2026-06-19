import { Link } from "react-router-dom";
import { CATEGORY_LABEL } from "../../../shared/constants/product";

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
