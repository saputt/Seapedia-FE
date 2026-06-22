// ==================== Role & Auth ====================

export type RoleName = "BUYER" | "SELLER" | "DRIVER" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
}

export interface LoginResponse {
  accessToken: string;
  username: string;
  userRoles: RoleName[];
  activeRole: RoleName;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SwitchRoleResponse {
  activeRole: RoleName;
  accessToken: string;
  userRoles: RoleName[];
}

// ==================== User/Profile ====================

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== Store ====================

export interface Store {
  id: string;
  name: string;
  imageUrl: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreInput {
  name: string;
  imageUrl?: string;
}

// ==================== Product ====================

export type ProductCategory = "ELECTRONICS" | "FASHION" | "HOME" | "FOOD" | "HOBBY";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  category: ProductCategory;
  storeId: string;
  store?: Store;
  isHidden?: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    reviews: number;
  };
  reviews?: ProductReview[];
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  storeId?: string;
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: ProductCategory;
  imageUrl?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  total: number;
}

// ==================== Cart ====================

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  userId: string;
  product: Product;
}

// ==================== Address ====================

export interface Address {
  id: string;
  label: string;
  fullAddress: string;
  phone: string;
  notes?: string;
  lat?: number;
  lng?: number;
  isDefault?: boolean;
  lastUsed?: boolean;
  userId: string;
  createdAt: string;
}

export interface AddressInput {
  label: string;
  fullAddress: string;
  phone: string;
  notes?: string;
  lat?: number;
  lng?: number;
}

// ==================== Order ====================

export type OrderStatus = "PENDING" | "READY_FOR_DELIVERY" | "ON_DELIVERY" | "DELIVERED" | "CANCELLED";
export type ShippingMethod = "INSTANT" | "NEXT_DAY" | "REGULAR";

export interface OrderItemData {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  storeId: string;
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  shippingMethod: ShippingMethod;
  addressSnapshot: Address;
  orderToken: string;
  notes?: string;
  driverId?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItemData[];
  statusLogs?: OrderStatusLog[];
  store?: Store;
}

export interface OrderStatusLog {
  id: string;
  status: OrderStatus;
  timestamp: string;
}

export interface OrderSummary {
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  discountName?: string;
}

export interface CheckoutInput {
  orderToken: string;
  addressId: string;
}

// ==================== Wallet ====================

export type WalletTransactionType = "TOP_UP" | "PAYMENT" | "REFUND" | "SELLER_EARNING" | "DRIVER_EARNING";

export interface Wallet {
  id: string;
  balance: number;
  userId: string;
  createdAt: string;
}

export interface WalletTransaction {
  id: string;
  amount: number;
  type: WalletTransactionType;
  description: string;
  createdAt: string;
}

// ==================== Discount ====================

export interface Discount {
  id: string;
  code: string;
  name: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minPurchase: number;
  maxUsage: number;
  usageCount: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
}

export interface DiscountInput {
  code: string;
  name: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minPurchase: number;
  maxUsage: number;
  expiresAt: string;
}

export interface DiscountCheck {
  valid: boolean;
  discount?: Discount;
  message?: string;
}

// ==================== Review ====================

export interface ProductReview {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  productId: string;
  user?: { username: string };
  createdAt: string;
}

export interface AppReview {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  user?: { username: string };
  createdAt: string;
}

export interface ReviewInput {
  rating: number;
  comment: string;
}

// ==================== Driver ====================

export interface DriverJob {
  id: string;
  orderId: string;
  driverId?: string;
  status: string;
  order: Order;
}

// ==================== Admin ====================

export interface AdminDashboard {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
}

export interface SimulationStatus {
  lastRun: string | null;
  isRunning: boolean;
}

// ==================== API Response ====================

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

// ==================== Navbar ====================

export interface SidebarLink {
  to: string;
  label: string;
  icon: string;
}

// ==================== Shipping ====================

export interface ShippingOption {
  id: ShippingMethod;
  name: string;
  price: number;
  desc: string;
}
