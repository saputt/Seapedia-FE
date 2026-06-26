import { z } from "zod";

/**
 * Schema for adding a product to cart.
 * Used in addToCart API and related mutations.
 */
export const cartAddSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(999, "Quantity too large"),
  force: z.boolean().optional(),
});

export type CartAddInput = z.infer<typeof cartAddSchema>;

/**
 * Schema for updating cart item quantity.
 */
export const cartUpdateSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(999, "Quantity too large"),
});

export type CartUpdateInput = z.infer<typeof cartUpdateSchema>;

/**
 * Auth schemas
 */
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Product form schema (seller)
 */
export const productSchema = z.object({
  name: z.string().min(3, "Nama produk minimal 3 karakter").max(200),
  description: z.string().min(10, "Deskripsi minimal 10 karakter").max(5000),
  price: z.number().int().min(100, "Harga minimal Rp100"),
  stock: z.number().int().min(0, "Stok tidak boleh negatif"),
  category: z.enum(["ELECTRONICS", "FASHION", "HOME", "FOOD", "HOBBY"]),
  images: z.array(z.string()).optional(),
});

export type ProductInput = z.infer<typeof productSchema>;

/**
 * Discount form schema (admin)
 */
export const discountSchema = z.object({
  code: z.string().min(3, "Kode minimal 3 karakter").max(50).toUpperCase(),
  type: z.enum(["VOUCHER", "PROMO"], { message: "Tipe diskon tidak valid" }),
  value: z.number({ required_error: "Nilai wajib diisi" }).positive("Nilai harus > 0"),
  isPercent: z.boolean().default(false),
  usageLimit: z.number().int().positive("Maks penggunaan harus > 0").optional(),
  expiredAt: z.string().min(1, "Tanggal berakhir wajib diisi"),
});

export type DiscountInput = z.infer<typeof discountSchema>;

/**
 * Address form schema
 */
export const addressSchema = z.object({
  label: z.string().min(1, "Label wajib diisi").max(50),
  detail: z.string().min(1, "Alamat lengkap wajib diisi").max(500),
});

export type AddressInput = z.infer<typeof addressSchema>;

/**
 * Password change schema
 */
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Password saat ini wajib diisi"),
  newPassword: z.string().min(6, "Password baru minimal 6 karakter"),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Konfirmasi password tidak cocok",
  path: ["confirmNewPassword"],
});

export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;

/**
 * Generic validation function that throws ZodError if validation fails.
 */
export function validate<T>(schema: z.ZodType<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Store form schema (seller onboarding)
 */
export const storeSchema = z.object({
  name: z.string().min(3, "Nama toko minimal 3 karakter").max(100),
  description: z.string().min(10, "Deskripsi minimal 10 karakter").max(1000),
  address: z.string().min(1, "Alamat toko wajib diisi").max(500).optional(),
  imageUrl: z.string().optional(),
});

export type StoreInput = z.infer<typeof storeSchema>;

/**
 * Safe validation - returns { success: true, data } | { success: false, errors }
 */
export function safeValidate<T>(schema: z.ZodType<T>, data: unknown):
  | { success: true; data: T }
  | { success: false; errors: z.ZodFormattedError<T> } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error.format() };
}

/**
 * Review form schema
 */
export const reviewSchema = z.object({
  productId: z.string().uuid("Produk tidak valid"),
  orderItemId: z.string().uuid("Order item tidak valid"),
  rating: z.number().int().min(1, "Rating minimal 1").max(5, "Rating maksimal 5"),
  comment: z.string().min(10, "Ulasan minimal 10 karakter").max(2000, "Ulasan maksimal 2000 karakter"),
});

export type ReviewInput = z.infer<typeof reviewSchema>;