import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import RoleRoute from "./RoleRoute";
import LandingPage from "../pages/LandingPage";
import ComingSoon from "../shared/components/ui/ComingSoon";

const lazyLoad = (importFn, name) => {
  const Component = lazy(importFn);
  return (props) => (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-bg-primary">
          <div className="w-8 h-8 border-[3px] border-brand-deep border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

const LoginPage = lazyLoad(() => import("../pages/auth/LoginPage"), "LoginPage");
const RegisterPage = lazyLoad(() => import("../pages/auth/RegisterPage"), "RegisterPage");
const RoleSelectPage = lazyLoad(() => import("../pages/auth/RoleSelectPage"), "RoleSelectPage");
const ProductListPage = lazyLoad(() => import("../pages/products/ProductListPage"), "ProductListPage");
const ProductDetailPage = lazyLoad(() => import("../pages/products/ProductDetailPage"), "ProductDetailPage");
const CartMainPage = lazyLoad(() => import("../pages/cart/CartPage"), "CartMainPage");
const CheckoutMainPage = lazyLoad(() => import("../pages/checkout/CheckoutPage"), "CheckoutMainPage");
const CheckoutSuccessPage = lazyLoad(() => import("../pages/checkout/CheckoutSuccessPage"), "CheckoutSuccessPage");
const OrderHistoryPage = lazyLoad(() => import("../pages/dashboard/buyer/OrderHistoryPage"), "OrderHistoryPage");
const OrderDetailPage = lazyLoad(() => import("../pages/dashboard/buyer/OrderDetailPage"), "OrderDetailPage");
const WalletPage = lazyLoad(() => import("../pages/dashboard/buyer/WalletPage"), "WalletPage");

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/products/:productId" element={<ProductDetailPage />} />
      <Route path="/stores/:storeId" element={<ComingSoon title="Detail Toko" />} />
      <Route
        path="/cart"
        element={
          <PrivateRoute>
            <CartMainPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/checkout"
        element={
          <PrivateRoute>
            <CheckoutMainPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/checkout/success"
        element={
          <PrivateRoute>
            <CheckoutSuccessPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/auth/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/role-select"
        element={
          <PrivateRoute>
            <RoleSelectPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard/buyer"
        element={
          <PrivateRoute>
            <RoleRoute role="buyer">
              <ComingSoon title="Dashboard Pembeli" />
            </RoleRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/buyer/cart"
        element={
          <PrivateRoute>
            <RoleRoute role="buyer">
              <ComingSoon title="Keranjang" />
            </RoleRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/buyer/checkout"
        element={
          <PrivateRoute>
            <RoleRoute role="buyer">
              <CheckoutMainPage />
            </RoleRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/buyer/orders"
        element={
          <PrivateRoute>
            <RoleRoute role="buyer">
              <OrderHistoryPage />
            </RoleRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/buyer/orders/:orderId"
        element={
          <PrivateRoute>
            <RoleRoute role="buyer">
              <OrderDetailPage />
            </RoleRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/buyer/wallet"
        element={
          <PrivateRoute>
            <RoleRoute role="buyer">
              <WalletPage />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard/seller"
        element={
          <PrivateRoute>
            <RoleRoute role="seller">
              <ComingSoon title="Dashboard Penjual" />
            </RoleRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/seller/store"
        element={
          <PrivateRoute>
            <RoleRoute role="seller">
              <ComingSoon title="Pengaturan Toko" />
            </RoleRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/seller/products"
        element={
          <PrivateRoute>
            <RoleRoute role="seller">
              <ComingSoon title="Kelola Produk" />
            </RoleRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/seller/orders"
        element={
          <PrivateRoute>
            <RoleRoute role="seller">
              <ComingSoon title="Pesanan" />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard/driver"
        element={
          <PrivateRoute>
            <RoleRoute role="driver">
              <ComingSoon title="Dashboard Kurir" />
            </RoleRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/driver/jobs"
        element={
          <PrivateRoute>
            <RoleRoute role="driver">
              <ComingSoon title="Pekerjaan Tersedia" />
            </RoleRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/driver/history"
        element={
          <PrivateRoute>
            <RoleRoute role="driver">
              <ComingSoon title="Riwayat Pekerjaan" />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard/admin"
        element={
          <PrivateRoute>
            <RoleRoute role="admin">
              <ComingSoon title="Dashboard Admin" />
            </RoleRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/admin/promo"
        element={
          <PrivateRoute>
            <RoleRoute role="admin">
              <ComingSoon title="Kelola Promo" />
            </RoleRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/admin/voucher"
        element={
          <PrivateRoute>
            <RoleRoute role="admin">
              <ComingSoon title="Kelola Voucher" />
            </RoleRoute>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
