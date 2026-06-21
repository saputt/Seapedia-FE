import { Link } from "react-router-dom";
import type { Order } from "../../../../types";

interface TopSellingProductsProps {
  orders: Order[];
}

const TopSellingProducts = ({ orders = [] }: TopSellingProductsProps) => {
  const delivered = orders.filter((o) => o.status === "DELIVERED");

  const productMap = new Map<string, { name: string; sold: number; revenue: number; imageUrl: string | null }>();

  delivered.forEach((o) => {
    const items = (o as any).orderItems ?? (o as any).items ?? [];
    items.forEach((item: any) => {
      const existing = productMap.get(item.productId);
      if (existing) {
        existing.sold += item.quantity;
        existing.revenue += item.price * item.quantity;
      } else {
        productMap.set(item.productId, {
          name: item.product?.name ?? "Produk tidak ditemukan",
          sold: item.quantity,
          revenue: item.price * item.quantity,
          imageUrl: item.product?.imageUrl ?? null,
        });
      }
    });
  });

  const topProducts = Array.from(productMap.entries())
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  if (topProducts.length === 0) {
    return null;
  }

  return (
    <div className="card !p-5">
      <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-4">
        Produk Terlaris
      </h3>
      <div className="space-y-3">
        {topProducts.map((product, idx) => (
          <div key={product.id} className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-lg bg-brand-deep text-white text-xs font-bold flex items-center justify-center shrink-0">
              {idx + 1}
            </span>
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-10 h-10 rounded-lg object-cover shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">
                {product.name}
              </p>
              <p className="text-xs text-text-muted">
                {product.sold} terjual
              </p>
            </div>
            <p className="text-sm font-bold text-text-primary whitespace-nowrap">
              Rp{product.revenue.toLocaleString("id-ID")}
            </p>
          </div>
        ))}
      </div>
      {delivered.length > 0 && (
        <Link
          to="/dashboard/seller/products"
          className="block text-center text-xs font-semibold text-brand-deep mt-4 pt-3 border-t-3 border-border-default hover:opacity-80 transition-opacity"
        >
          Lihat semua produk →
        </Link>
      )}
    </div>
  );
};

export default TopSellingProducts;
