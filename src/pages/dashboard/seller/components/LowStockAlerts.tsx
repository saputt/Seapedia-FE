import { Link } from "react-router-dom";
import type { Product } from "../../../../types";

interface LowStockAlertsProps {
  products: Product[];
}

const THRESHOLD = 5;

const LowStockAlerts = ({ products }: LowStockAlertsProps) => {
  const lowStock = products
    .filter((p) => p.stock <= THRESHOLD)
    .sort((a, b) => a.stock - b.stock);

  return (
    <div className={`card !p-5 border-l-[4px] ${lowStock.length > 0 ? "border-danger" : "border-success"}`}>
      <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-4">
        Stok Menipis
      </h3>
      {lowStock.length === 0 ? (
        <div className="flex items-center gap-2 py-4">
          <span className="text-success text-lg">✓</span>
          <p className="text-sm text-text-muted">Semua stok aman</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {lowStock.slice(0, 5).map((product) => {
              const isCritical = product.stock <= 2;
              return (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-sm font-semibold text-text-primary truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      Kategori: {product.category}
                    </p>
                  </div>
                  <div
                    className={`shrink-0 px-3 py-1 rounded-lg text-xs font-bold border-3 ${
                      isCritical
                        ? "bg-red-50 text-danger border-danger"
                        : "bg-orange-50 text-orange-600 border-orange-400"
                    }`}
                  >
                    {product.stock}
                  </div>
                </div>
              );
            })}
          </div>
          {lowStock.length > 5 && (
            <p className="text-xs text-text-muted mt-3 text-center">
              +{lowStock.length - 5} produk lainnya
            </p>
          )}
        </>
      )}
      <Link
        to="/dashboard/seller/products"
        className="block text-center text-xs font-semibold text-brand-deep mt-3 pt-3 border-t-3 border-border-default hover:opacity-80 transition-opacity"
      >
        Atur produk →
      </Link>
    </div>
  );
};

export default LowStockAlerts;
