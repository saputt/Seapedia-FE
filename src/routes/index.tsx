import { lazy, Suspense, ComponentType } from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import RoleRoute from "./RoleRoute";
import BuyerRoute from "./BuyerRoute";
import LandingPage from "../pages/LandingPage";

import DashboardLayout from "../shared/components/layout/DashboardLayout";
import BuyerDashboardLayout from "../shared/components/layout/BuyerDashboardLayout";
import SellerRoute from "./SellerRoute";
import DriverRoute from "./DriverRoute";
import Spinner from "../shared/components/ui/Spinner";
import ErrorBoundary from "../shared/components/ui/ErrorBoundary";
import ScrollToTop from "../shared/utils/ScrollToTop";
import { sellerSidebarLinks, driverSidebarLinks, adminSidebarLinks } from "../shared/constants/sidebarLinks";

const lazyLoad = <T extends object>(importFn: () => Promise<{ default: ComponentType<T> }>) => {
  const Component = lazy(importFn);
  return (props: T) => (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-bg-primary">
            <Spinner size="lg" />
          </div>
        }
      >
        <Component {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

const LoginPage = lazyLoad(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazyLoad(() => import("../pages/auth/RegisterPage"));
const RoleSelectPage = lazyLoad(() => import("../pages/auth/RoleSelectPage"));
const ProductListPage = lazyLoad(() => import("../pages/products/ProductListPage"));
const ProductDetailPage = lazyLoad(() => import("../pages/products/ProductDetailPage"));
const StoreDetailPage = lazyLoad(() => import("../pages/stores/StoreDetailPage"));
const CartMainPage = lazyLoad(() => import("../pages/cart/CartPage"));
const CheckoutMainPage = lazyLoad(() => import("../pages/checkout/CheckoutPage"));
const CheckoutSuccessPage = lazyLoad(() => import("../pages/checkout/CheckoutSuccessPage"));
const OrderHistoryPage = lazyLoad(() => import("../pages/dashboard/buyer/OrderHistoryPage"));
const OrderDetailPage = lazyLoad(() => import("../pages/dashboard/buyer/OrderDetailPage"));
const WalletPage = lazyLoad(() => import("../pages/dashboard/buyer/WalletPage"));
const TransactionHistoryPage = lazyLoad(() => import("../pages/dashboard/buyer/TransactionHistoryPage"));
const ProfilePage = lazyLoad(() => import("../pages/dashboard/buyer/ProfilePage"));
const AddressPage = lazyLoad(() => import("../pages/dashboard/buyer/AddressPage"));
const StoreManagement = lazyLoad(() => import("../pages/dashboard/seller/StoreManagement"));
const CreateStorePage = lazyLoad(() => import("../pages/stores/CreateStorePage"));
const SellerDashboardPage = lazyLoad(() => import("../pages/dashboard/seller/SellerDashboardPage"));
const ProductManagementPage = lazyLoad(() => import("../pages/dashboard/seller/ProductManagementPage"));
const ProductEditPage = lazyLoad(() => import("../pages/dashboard/seller/ProductEditPage"));
const ProductCreatePage = lazyLoad(() => import("../pages/dashboard/seller/ProductCreatePage"));
const OrderManagementPage = lazyLoad(() => import("../pages/dashboard/seller/OrderManagementPage"));
const ProductRatingsPage = lazyLoad(() => import("../pages/dashboard/seller/ProductRatingsPage"));
const IncomeHistoryPage = lazyLoad(() => import("../pages/dashboard/seller/IncomeHistoryPage"));
const DriverDashboardPage = lazyLoad(() => import("../pages/dashboard/driver/DriverDashboardPage"));
const DriverJobsPage = lazyLoad(() => import("../pages/dashboard/driver/DriverJobsPage"));
const DriverHistoryPage = lazyLoad(() => import("../pages/dashboard/driver/DriverHistoryPage"));
const DriverIncomePage = lazyLoad(() => import("../pages/dashboard/driver/DriverIncomePage"));
const DriverRatingsPage = lazyLoad(() => import("../pages/dashboard/driver/DriverRatingsPage"));
const DriverProfilePage = lazyLoad(() => import("../pages/dashboard/driver/DriverProfilePage"));
const AdminDashboardPage = lazyLoad(() => import("../pages/dashboard/admin/AdminDashboardPage"));
const AdminUsersPage = lazyLoad(() => import("../pages/dashboard/admin/AdminUsersPage"));
const AdminStoresPage = lazyLoad(() => import("../pages/dashboard/admin/AdminStoresPage"));
const AdminDriversPage = lazyLoad(() => import("../pages/dashboard/admin/AdminDriversPage"));
const AdminProductsPage = lazyLoad(() => import("../pages/dashboard/admin/AdminProductsPage"));
const AdminOrdersPage = lazyLoad(() => import("../pages/dashboard/admin/AdminOrdersPage"));
const AdminDiscountsPage = lazyLoad(() => import("../pages/dashboard/admin/AdminDiscountsPage"));
const AdminSimulatePage = lazyLoad(() => import("../pages/dashboard/admin/AdminSimulatePage"));
const SellerOnboarding = lazyLoad(() => import("../pages/onboarding/SellerOnboarding"));
const DriverOnboarding = lazyLoad(() => import("../pages/onboarding/DriverOnboarding"));



const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
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
          <PrivateRoute>
            <BuyerRoute>
              <CartMainPage />
            </BuyerRoute>
          </PrivateRoute>
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
        path="/onboarding/seller"
        element={
          <PrivateRoute>
            <SellerOnboarding />
          </PrivateRoute>
        }
      />
      <Route
        path="/onboarding/driver"
        element={
          <PrivateRoute>
            <DriverOnboarding />
          </PrivateRoute>
        }
      />

      <Route
        element={
          <PrivateRoute>
            <RoleRoute role="buyer">
              <BuyerDashboardLayout />
            </RoleRoute>
          </PrivateRoute>
        }
      >
        <Route path="orders" element={<OrderHistoryPage />} />
        <Route path="orders/:orderId" element={<OrderDetailPage />} />
        <Route path="wallet" element={<WalletPage />} />
        <Route path="wallet/history" element={<TransactionHistoryPage />} />
        <Route path="addresses" element={<AddressPage />} />
        <Route path="profile" element={<ProfilePage />} />
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
        path="/dashboard/seller"
        element={
          <PrivateRoute>
            <SellerRoute>
              <DashboardLayout
                navbarVariant="seller"
                sidebarTitle="Toko Saya"
                sidebarSubtitle="Dashboard Penjual"
                sidebarLinks={sellerSidebarLinks}
                mobileNav="bottom-tabs"
              />
            </SellerRoute>
          </PrivateRoute>
        }
      >
        <Route index element={<SellerDashboardPage />} />
        <Route path="manage-store" element={<StoreManagement />} />
        <Route path="products" element={<ProductManagementPage />} />
        <Route path="products/create" element={<ProductCreatePage />} />
        <Route path="products/:productId/edit" element={<ProductEditPage />} />
        <Route path="orders" element={<OrderManagementPage />} />
        <Route path="ratings" element={<ProductRatingsPage />} />
        <Route path="income" element={<IncomeHistoryPage />} />
      </Route>

      <Route
        path="/dashboard/driver"
        element={
          <PrivateRoute>
            <DriverRoute>
              <DashboardLayout
                navbarVariant="seller"
                sidebarTitle="Driver"
                sidebarSubtitle="Dashboard Kurir"
                sidebarLinks={driverSidebarLinks}
                mobileNav="bottom-tabs"
              />
            </DriverRoute>
          </PrivateRoute>
        }
      >
        <Route index element={<DriverDashboardPage />} />
        <Route path="jobs" element={<DriverJobsPage />} />
        <Route path="history" element={<DriverHistoryPage />} />
        <Route path="income" element={<DriverIncomePage />} />
        <Route path="ratings" element={<DriverRatingsPage />} />
        <Route path="profile" element={<DriverProfilePage />} />
      </Route>

      <Route
        path="/dashboard/admin"
        element={
          <PrivateRoute>
            <RoleRoute role="admin">
              <DashboardLayout
                navbarVariant="seller"
                sidebarTitle="Admin Panel"
                sidebarSubtitle="Manajemen Sistem"
                sidebarLinks={adminSidebarLinks}
                mobileNav="bottom-tabs"
              />
            </RoleRoute>
          </PrivateRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="stores" element={<AdminStoresPage />} />
        <Route path="drivers" element={<AdminDriversPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="discounts" element={<AdminDiscountsPage />} />
        <Route path="simulate" element={<AdminSimulatePage />} />
      </Route>
    </Routes>
    </>
  );
};

export default AppRoutes;
