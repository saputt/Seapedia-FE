import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import RoleRoute from "./RoleRoute";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import RoleSelectPage from "../pages/auth/RoleSelectPage";
import HomePage from "../pages/public/HomePage";
import ProductListPage from "../pages/public/ProductListPage";
import ProductDetailPage from "../pages/public/ProductDetailPage";
import StoreDetailPage from "../pages/public/StoreDetailPage";
import BuyerDashboard from "../pages/dashboard/buyer/BuyerDashboard";
import CartPage from "../pages/dashboard/buyer/CartPage";
import CheckoutPage from "../pages/dashboard/buyer/CheckoutPage";
import OrderHistoryPage from "../pages/dashboard/buyer/OrderHistoryPage";
import WalletPage from "../pages/dashboard/buyer/WalletPage";
import SellerDashboard from "../pages/dashboard/seller/SellerDashboard";
import StoreSettingPage from "../pages/dashboard/seller/StoreSettingPage";
import ProductManagePage from "../pages/dashboard/seller/ProductManagePage";
import SellerOrderPage from "../pages/dashboard/seller/SellerOrderPage";
import DriverDashboard from "../pages/dashboard/driver/DriverDashboard";
import AvailableJobPage from "../pages/dashboard/driver/AvailableJobPage";
import JobHIstoryPage from "../pages/dashboard/driver/JobHIstoryPage";
import AdminDashboard from "../pages/dashboard/admin/AdminDashboard";
import PromoPage from "../pages/dashboard/admin/PromoPage";
import VoucherPage from "../pages/dashboard/admin/VoucherPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/products/:productId" element={<ProductDetailPage />} />
      <Route path="/stores/:storeId" element={<StoreDetailPage />} />

      {/* Auth (guest only) */}
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

      {/* Buyer Dashboard */}
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

      {/* Seller Dashboard */}
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

      {/* Driver Dashboard */}
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

      {/* Admin Dashboard */}
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
