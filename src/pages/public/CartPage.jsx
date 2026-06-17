import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../../shared/components/layout/MainLayout";
import AlertModal from "../../shared/components/ui/AlertModal";
import useCartStore from "../../features/cart/store/cartStore";
import {
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../../features/cart/api/cart.api";

const CartPage = () => {
  const navigate = useNavigate();
  const { items, setItems, refreshCart } = useCartStore();
  const [loading, setLoading] = useState(true);
  const [busyItems, setBusyItems] = useState({});
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    refreshCart().finally(() => setLoading(false));
  }, []);

  const handleUpdateQty = async (productId, newQty) => {
    if (newQty < 1) return;
    setBusyItems((prev) => ({ ...prev, [productId]: true }));
    try {
      const updated = await updateCartItem(productId, newQty);
      setItems(
        items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: updated.quantity }
            : item
        )
      );
    } catch {
      await refreshCart();
    } finally {
      setBusyItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleRemove = async (productId) => {
    setBusyItems((prev) => ({ ...prev, [productId]: true }));
    try {
      await removeCartItem(productId);
      setItems(items.filter((item) => item.productId !== productId));
    } catch {
      await refreshCart();
    } finally {
      setBusyItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleClear = async () => {
    await clearCart();
    setItems([]);
    setConfirmClear(false);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <MainLayout>
      <div className="max-w-[960px] mx-auto w-full px-6 lg:px-8 py-8">
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

        {!loading && items.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-secondary text-lg mb-4">
              Keranjang belanja Anda masih kosong.
            </p>
            <Link
              to="/products"
              className="btn-primary text-sm !py-2 !px-6 inline-block"
            >
              Mulai Belanja
            </Link>
          </div>
        )}

        {!loading && items.length > 0 && (
          <>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="card">
                  {/* Mobile layout */}
                  <div className="flex flex-col gap-3 sm:hidden">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 bg-bg-tertiary rounded flex items-center justify-center overflow-hidden shrink-0">
                        {item.product?.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-text-muted">No Image</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/products/${item.productId}`}
                          className="text-sm font-semibold text-text-primary hover:text-brand-deep transition-colors line-clamp-2"
                        >
                          {item.product?.name}
                        </Link>
                        <p className="text-xs text-text-muted mt-0.5">
                          {item.product?.store?.storeName}
                        </p>
                        <p className="text-sm font-bold text-brand-deep mt-1">
                          Rp{item.product?.price?.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemove(item.productId)}
                        disabled={busyItems[item.productId]}
                        className="text-text-muted hover:text-danger transition-colors disabled:opacity-40 shrink-0 mt-1"
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
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQty(item.productId, item.quantity - 1)}
                          disabled={busyItems[item.productId] || item.quantity <= 1}
                          className="w-8 h-8 border-[2px] border-brand-deep rounded text-brand-deep font-bold text-lg flex items-center justify-center hover:bg-brand-subtle transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          &minus;
                        </button>
                        <span className="w-8 text-center font-semibold text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQty(item.productId, item.quantity + 1)}
                          disabled={busyItems[item.productId]}
                          className="w-8 h-8 border-[2px] border-brand-deep rounded text-brand-deep font-bold text-lg flex items-center justify-center hover:bg-brand-subtle transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-text-primary">
                        Rp{(item.product?.price * item.quantity).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden sm:flex items-center gap-4">
                    <div className="w-20 h-20 bg-bg-tertiary rounded flex items-center justify-center overflow-hidden shrink-0">
                      {item.product?.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-text-muted">No Image</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${item.productId}`}
                        className="text-sm font-semibold text-text-primary hover:text-brand-deep transition-colors line-clamp-2"
                      >
                        {item.product?.name}
                      </Link>
                      <p className="text-xs text-text-muted mt-0.5">
                        {item.product?.store?.storeName}
                      </p>
                      <p className="text-sm font-bold text-brand-deep mt-1">
                        Rp{item.product?.price?.toLocaleString("id-ID")}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleUpdateQty(item.productId, item.quantity - 1)}
                        disabled={busyItems[item.productId] || item.quantity <= 1}
                        className="w-8 h-8 border-[2px] border-brand-deep rounded text-brand-deep font-bold text-lg flex items-center justify-center hover:bg-brand-subtle transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        &minus;
                      </button>
                      <span className="w-8 text-center font-semibold text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQty(item.productId, item.quantity + 1)}
                        disabled={busyItems[item.productId]}
                        className="w-8 h-8 border-[2px] border-brand-deep rounded text-brand-deep font-bold text-lg flex items-center justify-center hover:bg-brand-subtle transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>

                    <p className="text-sm font-semibold text-text-primary w-24 text-right shrink-0">
                      Rp{(item.product?.price * item.quantity).toLocaleString("id-ID")}
                    </p>

                    <button
                      onClick={() => handleRemove(item.productId)}
                      disabled={busyItems[item.productId]}
                      className="text-text-muted hover:text-danger transition-colors disabled:opacity-40 shrink-0"
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
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="card mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center justify-between sm:justify-start gap-4">
                <button
                  onClick={() => setConfirmClear(true)}
                  className="btn-ghost text-sm !py-2 !px-5"
                >
                  Hapus Semua
                </button>
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
                <button
                  onClick={() => navigate("/checkout")}
                  className="btn-primary text-sm !py-2 !px-6 w-full sm:w-auto"
                >
                  Lanjut ke Checkout
                </button>
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
