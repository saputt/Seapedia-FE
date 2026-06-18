import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import RoleRoute from "./RoleRoute";
import BuyerRoute from "./BuyerRoute";
import LandingPage from "../pages/LandingPage";
import ComingSoon from "../shared/components/ui/ComingSoon";
import SellerLayout from "../shared/components/layout/SellerLayout";
import DriverLayout from "../shared/components/layout/DriverLayout";
import SellerRoute from "./SellerRoute";

const lazyLoad = (importFn) => {
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
const StoreDetailPage = lazyLoad(() => import("../pages/stores/StoreDetailPage"), "StoreDetailPage");
const CartMainPage = lazyLoad(() => import("../pages/cart/CartPage"), "CartMainPage");
const CheckoutMainPage = lazyLoad(() => import("../pages/checkout/CheckoutPage"), "CheckoutMainPage");
const CheckoutSuccessPage = lazyLoad(() => import("../pages/checkout/CheckoutSuccessPage"), "CheckoutSuccessPage");
const OrderHistoryPage = lazyLoad(() => import("../pages/dashboard/buyer/OrderHistoryPage"), "OrderHistoryPage");
const OrderDetailPage = lazyLoad(() => import("../pages/dashboard/buyer/OrderDetailPage"), "OrderDetailPage");
const WalletPage = lazyLoad(() => import("../pages/dashboard/buyer/WalletPage"), "WalletPage");
const StoreManagement = lazyLoad(() => import("../pages/dashboard/seller/StoreManagement"), "StoreManagement");
const CreateStorePage = lazyLoad(() => import("../pages/stores/CreateStorePage"), "CreateStorePage");
const SellerDashboardPage = lazyLoad(() => import("../pages/dashboard/seller/SellerDashboardPage"), "SellerDashboardPage");
const ProductManagementPage = lazyLoad(() => import("../pages/dashboard/seller/ProductManagementPage"), "ProductManagementPage");
const OrderManagementPage = lazyLoad(() => import("../pages/dashboard/seller/OrderManagementPage"), "OrderManagementPage");
const IncomeHistoryPage = lazyLoad(() => import("../pages/dashboard/seller/IncomeHistoryPage"), "IncomeHistoryPage");
const DriverDashboardPage = lazyLoad(() => import("../pages/dashboard/driver/DriverDashboardPage"), "DriverDashboardPage");
const DriverJobsPage = lazyLoad(() => import("../pages/dashboard/driver/DriverJobsPage"), "DriverJobsPage");
const DriverHistoryPage = lazyLoad(() => import("../pages/dashboard/driver/DriverHistoryPage"), "DriverHistoryPage");
const DriverIncomePage = lazyLoad(() => import("../pages/dashboard/driver/DriverIncomePage"), "DriverIncomePage");

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/products"
        element={
          <BuyerRoute>
            <ProductListPage />
          </BuyerRoute>
        }
      />
      <Route
        path="/products/:productId"
        element={
          <BuyerRoute>
            <ProductDetailPage />
          </BuyerRoute>
        }
      />
      <Route path="/stores/:storeId" element={<StoreDetailPage />} />
      <Route
        path="/cart"
        element={
          <BuyerRoute>
            <CartMainPage />
          </BuyerRoute>
        }
      />

      <Route
        path="/checkout"
        element={
          <PrivateRoute>
            <BuyerRoute>
              <CheckoutMainPage />
            </BuyerRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/checkout/success"
        element={
          <PrivateRoute>
            <BuyerRoute>
              <CheckoutSuccessPage />
            </BuyerRoute>
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
            <BuyerRoute>
              <ComingSoon title="Dashboard Pembeli" />
            </BuyerRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/buyer/cart"
        element={
          <PrivateRoute>
            <BuyerRoute>
              <ComingSoon title="Keranjang" />
            </BuyerRoute>
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
          <SellerRoute>
            <SellerLayout />
          </SellerRoute>
        }
      >
        <Route index element={<SellerDashboardPage />} />
        <Route path="manage-store" element={<StoreManagement />} />
        <Route path="products" element={<ProductManagementPage />} />
        <Route path="orders" element={<OrderManagementPage />} />
        <Route path="income" element={<IncomeHistoryPage />} />
      </Route>

      <Route
        path="/dashboard/seller/create-store"
        element={
          <PrivateRoute>
            <CreateStorePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard/driver"
        element={
          <PrivateRoute>
            <RoleRoute role="driver">
              <DriverLayout />
            </RoleRoute>
          </PrivateRoute>
        }
      >
        <Route index element={<DriverDashboardPage />} />
        <Route path="jobs" element={<DriverJobsPage />} />
        <Route path="history" element={<DriverHistoryPage />} />
        <Route path="income" element={<DriverIncomePage />} />
      </Route>

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
