import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import RoleRoute from "./RoleRoute";
import BuyerRoute from "./BuyerRoute";
import LandingPage from "../pages/LandingPage";
import ComingSoon from "../shared/components/ui/ComingSoon";
import BuyerLayout from "../shared/components/layout/BuyerLayout";
import SellerLayout from "../shared/components/layout/SellerLayout";
import DriverLayout from "../shared/components/layout/DriverLayout";
import AdminLayout from "../shared/components/layout/AdminLayout";
import SellerRoute from "./SellerRoute";
import Spinner from "../shared/components/ui/Spinner";

const lazyLoad = (importFn) => {
  const Component = lazy(importFn);
  return (props) => (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-bg-primary">
          <Spinner size="lg" />
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
const TransactionHistoryPage = lazyLoad(() => import("../pages/dashboard/buyer/TransactionHistoryPage"), "TransactionHistoryPage");
const ProfilePage = lazyLoad(() => import("../pages/dashboard/buyer/ProfilePage"), "ProfilePage");
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
const AdminDashboardPage = lazyLoad(() => import("../pages/dashboard/admin/AdminDashboardPage"), "AdminDashboardPage");
const AdminOrdersPage = lazyLoad(() => import("../pages/dashboard/admin/AdminOrdersPage"), "AdminOrdersPage");
const AdminDiscountsPage = lazyLoad(() => import("../pages/dashboard/admin/AdminDiscountsPage"), "AdminDiscountsPage");
const AdminSimulatePage = lazyLoad(() => import("../pages/dashboard/admin/AdminSimulatePage"), "AdminSimulatePage");

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <BuyerRoute>
            <ProductListPage />
          </BuyerRoute>
        }
      />
      <Route
        path="/about"
        element={<LandingPage />}
      />
      <Route
        path="/products"
        element={<Navigate to="/" replace />}
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
            <RoleRoute role="buyer">
              <BuyerLayout />
            </RoleRoute>
          </PrivateRoute>
        }
      >
        <Route index element={<ComingSoon title="Dashboard Pembeli" />} />
        <Route path="cart" element={<ComingSoon title="Keranjang" />} />
        <Route path="checkout" element={<CheckoutMainPage />} />
        <Route path="orders" element={<OrderHistoryPage />} />
        <Route path="orders/:orderId" element={<OrderDetailPage />} />
        <Route path="wallet" element={<WalletPage />} />
        <Route path="wallet/history" element={<TransactionHistoryPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route
        path="/dashboard/seller"
        element={
          <PrivateRoute>
            <SellerRoute>
              <SellerLayout />
            </SellerRoute>
          </PrivateRoute>
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
              <AdminLayout />
            </RoleRoute>
          </PrivateRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="discounts" element={<AdminDiscountsPage />} />
        <Route path="simulate" element={<AdminSimulatePage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
