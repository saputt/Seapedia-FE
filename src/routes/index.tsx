import { lazy, Suspense, ComponentType } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import RoleRoute from "./RoleRoute";
import BuyerRoute from "./BuyerRoute";
import LandingPage from "../pages/LandingPage";
import ComingSoon from "../shared/components/ui/ComingSoon";
import DashboardLayout from "../shared/components/layout/DashboardLayout";
import BuyerDashboardLayout from "../shared/components/layout/BuyerDashboardLayout";
import SellerRoute from "./SellerRoute";
import Spinner from "../shared/components/ui/Spinner";
import { SidebarLink } from "../types";

const lazyLoad = <T extends object>(importFn: () => Promise<{ default: ComponentType<T> }>) => {
  const Component = lazy(importFn);
  return (props: T) => (
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
const AdminDashboardPage = lazyLoad(() => import("../pages/dashboard/admin/AdminDashboardPage"));
const AdminOrdersPage = lazyLoad(() => import("../pages/dashboard/admin/AdminOrdersPage"));
const AdminDiscountsPage = lazyLoad(() => import("../pages/dashboard/admin/AdminDiscountsPage"));
const AdminSimulatePage = lazyLoad(() => import("../pages/dashboard/admin/AdminSimulatePage"));
const SellerOnboarding = lazyLoad(() => import("../pages/onboarding/SellerOnboarding"));
const DriverOnboarding = lazyLoad(() => import("../pages/onboarding/DriverOnboarding"));

const sellerSidebarLinks: SidebarLink[] = [
  { to: "/dashboard/seller", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { to: "/dashboard/seller/manage-store", label: "Manajemen Toko", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { to: "/dashboard/seller/products", label: "Produk", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { to: "/dashboard/seller/ratings", label: "Penilaian", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
  { to: "/dashboard/seller/orders", label: "Pesanan", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { to: "/dashboard/seller/income", label: "Pemasukkan", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
];

const driverSidebarLinks: SidebarLink[] = [
  { to: "/dashboard/driver", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { to: "/dashboard/driver/jobs", label: "Pekerjaan Tersedia", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { to: "/dashboard/driver/history", label: "Riwayat", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  { to: "/dashboard/driver/income", label: "Pemasukkan", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
];

const adminSidebarLinks: SidebarLink[] = [
  { to: "/dashboard/admin", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { to: "/dashboard/admin/orders", label: "Pesanan", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { to: "/dashboard/admin/discounts", label: "Diskon", icon: "M12 8c-1.131 0-2 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { to: "/dashboard/admin/simulate", label: "Simulasi", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
];

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
        path="/dashboard/buyer"
        element={
          <PrivateRoute>
            <RoleRoute role="buyer">
              <BuyerDashboardLayout />
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
            <RoleRoute role="driver">
              <DashboardLayout
                navbarVariant="seller"
                sidebarTitle="Driver"
                sidebarSubtitle="Dashboard Kurir"
                sidebarLinks={driverSidebarLinks}
                mobileNav="bottom-tabs"
              />
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
              <DashboardLayout
                navbarVariant="seller"
                sidebarTitle="Admin Panel"
                sidebarSubtitle="Manajemen Sistem"
                sidebarLinks={adminSidebarLinks}
                mobileNav="hamburger"
              />
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
