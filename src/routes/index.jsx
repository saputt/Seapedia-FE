import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import RoleRoute from "./RoleRoute";
import LandingPage from "../pages/LandingPage";

const Placeholder = ({ title }) => (
  <div className="min-h-screen flex items-center justify-center bg-bg-primary">
    <div className="card text-center max-w-md">
      <h2 className="text-2xl font-bold text-brand-deep mb-2">{title}</h2>
      <p className="text-text-secondary">Halaman ini sedang dalam pengembangan.</p>
    </div>
  </div>
);

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
const HomePage = lazyLoad(() => import("../pages/public/HomePage"), "HomePage");
const ProductListPage = lazyLoad(() => import("../pages/public/ProductListPage"), "ProductListPage");
const ProductDetailPage = lazyLoad(() => import("../pages/public/ProductDetailPage"), "ProductDetailPage");
const StoreDetailPage = lazyLoad(() => import("../pages/public/StoreDetailPage"), "StoreDetailPage");
const BuyerDashboard = lazyLoad(() => import("../pages/dashboard/buyer/BuyerDashboard"), "BuyerDashboard");
const CartPage = lazyLoad(() => import("../pages/dashboard/buyer/CartPage"), "CartPage");
const PublicCartPage = lazyLoad(() => import("../pages/public/CartPage"), "PublicCartPage");
const CheckoutPage = lazyLoad(() => import("../pages/dashboard/buyer/CheckoutPage"), "CheckoutPage");
const PublicCheckoutPage = lazyLoad(() => import("../pages/public/CheckoutPage"), "PublicCheckoutPage");
const OrderHistoryPage = lazyLoad(() => import("../pages/dashboard/buyer/OrderHistoryPage"), "OrderHistoryPage");
const WalletPage = lazyLoad(() => import("../pages/dashboard/buyer/WalletPage"), "WalletPage");
const SellerDashboard = lazyLoad(() => import("../pages/dashboard/seller/SellerDashboard"), "SellerDashboard");
const StoreSettingPage = lazyLoad(() => import("../pages/dashboard/seller/StoreSettingPage"), "StoreSettingPage");
const ProductManagePage = lazyLoad(() => import("../pages/dashboard/seller/ProductManagePage"), "ProductManagePage");
const SellerOrderPage = lazyLoad(() => import("../pages/dashboard/seller/SellerOrderPage"), "SellerOrderPage");
const DriverDashboard = lazyLoad(() => import("../pages/dashboard/driver/DriverDashboard"), "DriverDashboard");
const AvailableJobPage = lazyLoad(() => import("../pages/dashboard/driver/AvailableJobPage"), "AvailableJobPage");
const JobHIstoryPage = lazyLoad(() => import("../pages/dashboard/driver/JobHIstoryPage"), "JobHIstoryPage");
const AdminDashboard = lazyLoad(() => import("../pages/dashboard/admin/AdminDashboard"), "AdminDashboard");
const PromoPage = lazyLoad(() => import("../pages/dashboard/admin/PromoPage"), "PromoPage");
const VoucherPage = lazyLoad(() => import("../pages/dashboard/admin/VoucherPage"), "VoucherPage");

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/products/:productId" element={<ProductDetailPage />} />
      <Route path="/stores/:storeId" element={<StoreDetailPage />} />
      <Route
        path="/cart"
        element={
          <PrivateRoute>
            <PublicCartPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/checkout"
        element={
          <PrivateRoute>
            <PublicCheckoutPage />
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
              <BuyerDashboard />
            </RoleRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/buyer/cart"
        element={
          <PrivateRoute>
            <RoleRoute role="buyer">
              <CartPage />
            </RoleRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/buyer/checkout"
        element={
          <PrivateRoute>
            <RoleRoute role="buyer">
              <CheckoutPage />
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
              <SellerDashboard />
            </RoleRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/seller/store"
        element={
          <PrivateRoute>
            <RoleRoute role="seller">
              <StoreSettingPage />
            </RoleRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/seller/products"
        element={
          <PrivateRoute>
            <RoleRoute role="seller">
              <ProductManagePage />
            </RoleRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/seller/orders"
        element={
          <PrivateRoute>
            <RoleRoute role="seller">
              <SellerOrderPage />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard/driver"
        element={
          <PrivateRoute>
            <RoleRoute role="driver">
              <DriverDashboard />
            </RoleRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/driver/jobs"
        element={
          <PrivateRoute>
            <RoleRoute role="driver">
              <AvailableJobPage />
            </RoleRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/driver/history"
        element={
          <PrivateRoute>
            <RoleRoute role="driver">
              <JobHIstoryPage />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard/admin"
        element={
          <PrivateRoute>
            <RoleRoute role="admin">
              <AdminDashboard />
            </RoleRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/admin/promo"
        element={
          <PrivateRoute>
            <RoleRoute role="admin">
              <PromoPage />
            </RoleRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/admin/voucher"
        element={
          <PrivateRoute>
            <RoleRoute role="admin">
              <VoucherPage />
            </RoleRoute>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
