import { useNavigate } from "react-router-dom";
import MainLayout from "../../shared/components/layout/MainLayout";

const CheckoutSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <MainLayout navbarVariant="checkout">
      <div className="flex items-center justify-center py-20 px-6">
        <div className="card text-center max-w-md">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Pembayaran Berhasil!
          </h2>
          <p className="text-text-secondary mb-6">
            Pesanan Anda sedang diproses. Silakan pantau status pesanan Anda.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate("/dashboard/buyer/orders")}
              className="btn-primary text-sm !py-2 !px-6"
            >
              Lihat Pesanan
            </button>
            <button
              onClick={() => navigate("/products")}
              className="btn-ghost text-sm !py-2 !px-6"
            >
              Cari Produk Lain
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CheckoutSuccessPage;
