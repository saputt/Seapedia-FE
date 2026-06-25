import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../../shared/components/layout/MainLayout";
import AlertModal from "../../shared/components/ui/AlertModal";
import Button from "../../shared/components/ui/Button";
import CartItem from "../../features/cart/components/CartItem";
import useCartStore from "../../features/cart/store/cartStore";
import { useUpdateCartItem, useRemoveCartItem, useClearCart } from "../../features/cart/hooks/useCartMutations";
import { prefetchOrderSummary } from "@/shared/utils/prefetch";

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const refreshCart = useCartStore((s) => s.refreshCart);
  const setItems = useCartStore((s) => s.setItems);
  const [loading, setLoading] = useState(true);
  const [busyItems, setBusyItems] = useState<Record<string, boolean>>({});
  const [confirmClear, setConfirmClear] = useState(false);
  const [removedHidden, setRemovedHidden] = useState<string[]>([]);

  const updateMutation = useUpdateCartItem();
  const removeMutation = useRemoveCartItem();

  const clearMutation = useClearCart();

  useEffect(() => {
    refreshCart().finally(() => setLoading(false));
  }, [refreshCart]);

  useEffect(() => {
    if (!loading && items.length > 0) {
      const itemsForSummary = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));
      prefetchOrderSummary({
        items: itemsForSummary,
        shippingMethod: "REGULAR",
      });
    }
  }, [loading, items]);

  useEffect(() => {
    if (loading) return;
    const hiddenItems = items.filter((item) => (item.product as any).isHidden);
    if (hiddenItems.length > 0) {
      setRemovedHidden(hiddenItems.map((i) => i.product.name));
      const remainingItems = items.filter((item) => !(item.product as any).isHidden);
      setItems(remainingItems);
      hiddenItems.forEach((item) => {
        removeMutation.mutate(item.productId);
      });
    }
  }, [loading]);

  const handleUpdateQty = (productId: string, newQty: number) => {
    if (newQty < 1) return;
    setBusyItems((prev) => ({ ...prev, [productId]: true }));
    updateMutation.mutate(
      { productId, quantity: newQty },
      { onSettled: () => setBusyItems((prev) => ({ ...prev, [productId]: false })) }
    );
  };

  const handleRemove = (productId: string) => {
    setBusyItems((prev) => ({ ...prev, [productId]: true }));
    removeMutation.mutate(productId, {
      onSettled: () => setBusyItems((prev) => ({ ...prev, [productId]: false })),
    });
  };

  const handleClear = () => {
    clearMutation.mutate();
    setConfirmClear(false);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <MainLayout>
      <div className="max-w-[960px] mx-auto w-full px-3 lg:px-8 py-8">
        <h1 className="text-[1.75rem] font-bold text-text-primary mb-8">
          Keranjang
        </h1>

        {loading && (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card flex gap-4">
                <div className="w-20 h-20 bg-bg-tertiary shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-bg-tertiary rounded w-1/2" />
                  <div className="h-4 bg-bg-tertiary rounded w-1/4" />
                  <div className="h-4 bg-bg-tertiary rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && items.length === 0 && removedHidden.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-secondary text-lg mb-4">
              Keranjang belanja Anda masih kosong.
            </p>
            <Link
              to="/"
              className="btn-primary text-sm !py-2 !px-6 inline-block"
            >
              Mulai Belanja
            </Link>
          </div>
        )}

        {!loading && items.length === 0 && removedHidden.length > 0 && (
          <div className="text-center py-20">
            <p className="text-text-secondary text-lg mb-4">
              Keranjang belanja Anda masih kosong.
            </p>
            <p className="text-text-muted text-sm mb-6">
              {removedHidden.length} produk telah dihapus karena disembunyikan oleh admin.
            </p>
            <Link
              to="/"
              className="btn-primary text-sm !py-2 !px-6 inline-block"
            >
              Mulai Belanja
            </Link>
          </div>
        )}

        {!loading && items.length > 0 && (
          <>
            {removedHidden.length > 0 && (
              <div className="mb-4 p-3 bg-danger/10 border-2 border-danger rounded-lg text-sm text-danger font-medium">
                {removedHidden.length} produk telah disembunyikan oleh admin dan dihapus dari keranjang.
              </div>
            )}
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  busy={busyItems[item.productId]}
                  onUpdateQty={handleUpdateQty}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            {/* Summary */}
            <div className="card mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center justify-between sm:justify-start gap-4">
                <Button
                  onClick={() => setConfirmClear(true)}
                  variant="ghost"
                  size="sm"
                >
                  Hapus Semua
                </Button>
                <div className="sm:hidden">
                  <p className="text-xs text-text-muted">Subtotal</p>
                  <p className="text-lg font-extrabold text-brand-deep">
                    Rp{subtotal.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                <div className="hidden sm:block">
                  <p className="text-xs text-text-muted">Subtotal</p>
                  <p className="text-xl font-extrabold text-brand-deep">
                    Rp{subtotal.toLocaleString("id-ID")}
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/checkout")}
                  variant="primary"
                  size="sm"
                >
                  Lanjut ke Checkout
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <AlertModal
        isOpen={confirmClear}
        onClose={() => setConfirmClear(false)}
        icon="🗑️"
        title="Hapus Semua"
        message="Apakah Anda yakin ingin menghapus semua item dari keranjang?"
        actionLabel="Hapus"
        onAction={handleClear}
      />
    </MainLayout>
  );
};

export default CartPage;
