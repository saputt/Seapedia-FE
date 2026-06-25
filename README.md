# SEAPEDIA Frontend

Frontend aplikasi e-commerce multi-role SEAPEDIA — dibangun dengan **React 19 + Vite 8 + TypeScript + Tailwind v4**.

---

## Daftar Isi

1. [Deployment Information](#deployment-information)
2. [Tech Stack](#tech-stack)
3. [Environment Variables](#environment-variables)
4. [Local Setup & Running Guide](#local-setup--running-guide)
5. [Routing Structure](#routing-structure)
6. [Features Overview](#features-overview)
7. [Business Rules](#business-rules)
8. [Security Notes](#security-notes)

---

## Deployment Information

| Environment | URL |
|---|---|
| **Frontend (Production)** | `https://seapedia-nine.vercel.app` |
| **Backend API** | `https://saukiputraa-seapedia-be.hf.space` |
| **Swagger Docs** | `https://saukiputraa-seapedia-be.hf.space/docs` |

---

## Tech Stack

| Lapisan | Teknologi |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 8 |
| Bahasa | TypeScript |
| Styling | Tailwind CSS v4 |
| Routing | react-router-dom v7 |
| State Management | Zustand v5 |
| Server State | TanStack React Query v5 |
| Forms | react-hook-form + Zod |
| Charts | Recharts |
| HTTP Client | Fetch (custom wrapper) |
| XSS Prevention | DOMPurify |

---

## Environment Variables

Buat file `.env` di root `Frontend/`:

```env
VITE_API_URL="http://localhost:3000/api/"
```

Untuk production, set `VITE_API_URL` ke URL Backend yang sudah di-deploy.

---

## Local Setup & Running Guide

### Prasyarat

- Node.js v22+
- Backend SEAPEDIA harus berjalan (local atau production)

### Langkah Instalasi

```bash
# 1. Clone repositori
git clone <repo-url>
cd SEAPEDIA/Frontend

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit VITE_API_URL sesuai dengan URL Backend

# 4. Jalankan development server
npm run dev
```

Server akan berjalan di `http://localhost:5173`.

### Scripts yang Tersedia

| Script | Kegunaan |
|---|---|
| `npm run dev` | Development server dengan HMR |
| `npm run build` | Build production ke `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint check |
| `npm run test` | Unit test (Vitest) |

---

## Routing Structure

### Public Routes (Tanpa Login)

| Route | Halaman | Guard |
|---|---|---|
| `/` | Product listing & search | Public |
| `/about` | Landing page, hero, testimonials | Public |
| `/products/:productId` | Product detail | Public |
| `/stores/:storeId` | Store detail | Public |
| `/auth/login` | Login | GuestOnly |
| `/auth/register` | Register | GuestOnly |

### Protected Routes (Perlu Login)

| Route | Halaman | Role |
|---|---|---|
| `/auth/role-select` | Pilih active role | All roles |
| `/profile` | Profile user | All roles |
| `/cart` | Cart | BUYER |
| `/checkout` | Checkout | BUYER |
| `/orders` | Order history | BUYER |
| `/orders/:orderId` | Order detail | BUYER |
| `/wallet` | Wallet & top-up | BUYER |
| `/wallet/history` | Riwayat transaksi | BUYER |
| `/addresses` | Manajemen alamat | BUYER |
| `/dashboard/buyer` | Dashboard buyer | BUYER |
| `/dashboard/seller` | Dashboard seller | SELLER |
| `/dashboard/seller/products` | Manajemen produk | SELLER |
| `/dashboard/seller/store` | Pengaturan toko | SELLER |
| `/dashboard/seller/orders` | Pesanan masuk | SELLER |
| `/dashboard/seller/income` | Laporan pendapatan | SELLER |
| `/dashboard/driver` | Dashboard driver | DRIVER |
| `/dashboard/driver/jobs` | Cari pekerjaan | DRIVER |
| `/dashboard/driver/history` | Riwayat pekerjaan | DRIVER |
| `/dashboard/driver/income` | Pendapatan driver | DRIVER |
| `/dashboard/admin` | Dashboard admin | ADMIN |
| `/dashboard/admin/users` | Kelola users | ADMIN |
| `/dashboard/admin/stores` | Kelola toko | ADMIN |
| `/dashboard/admin/products` | Kelola produk | ADMIN |
| `/dashboard/admin/orders` | Semua pesanan | ADMIN |
| `/dashboard/admin/discounts` | Kelola diskon | ADMIN |
| `/dashboard/admin/drivers` | Kelola driver | ADMIN |
| `/dashboard/admin/simulate` | Simulasi overdue | ADMIN |

---

## Features Overview

### Per Role

#### Guest / Public
- Browse product catalog dengan search, filter kategori, filter harga
- Lihat detail produk dengan info toko dan review
- Lihat testimonial / application reviews
- Login & register

#### Buyer
- Manajemen alamat pengiriman (CRUD + set default)
- Top-up wallet saldo
- Cart: tambah, update qty, hapus item, clear cart
- Checkout: pilih alamat, pilih kurir, apply diskon, ringkasan pesanan
- Order history & detail dengan timeline status
- Konfirmasi delivery
- Batalkan pesanan (saat PENDING)
- Riwayat transaksi wallet dengan filter

#### Seller
- Buat & edit profil toko
- CRUD produk (nama, harga, stok, deskripsi, gambar, kategori)
- Lihat pesanan masuk, proses pesanan (→ siap dikirim)
- Laporan pendapatan dengan filter tanggal

#### Driver
- Lihat job tersedia, ambil job
- Tandai delivery selesai
- Riwayat pekerjaan
- Pendapatan driver dengan filter tanggal

#### Admin
- Dashboard monitoring: users, stores, products, orders, drivers
- CRUD voucher & promo (tipe, nilai, expired, max uses)
- Kelola driver (suspend/unsuspend)
- Simulasi overdue dengan SLA per metode kirim

---

## Business Rules

1. **Role System** — Setiap user bisa punya banyak role (BUYER, SELLER, DRIVER). ADMIN khusus terpisah. User harus memilih active role setelah login.

2. **Single-Store Checkout** — Cart hanya boleh berisi produk dari 1 toko. Jika ingin ganti toko, cart harus di-clear dulu.

3. **Order Lifecycle**: `PENDING` → (Seller) → `READY_FOR_DELIVERY` → (Driver take job) → `ON_DELIVERY` → (Buyer confirm) → `DELIVERED`. Buyer hanya bisa cancel saat PENDING.

4. **Checkout 2-Step**: Step 1 → Order summary (hitung subtotal, diskon, ongkir, PPN 12%) → dapat `orderToken` (berlaku 5 menit). Step 2 → Checkout pakai token + address.

5. **Shipping Methods**: INSTANT (Rp15.000), NEXT_DAY (Rp20.000), REGULAR (Rp10.000).

6. **PPN 12%**: Dihitung dari `(subtotal - discountValue) × 12%`.

7. **Discount**: VOUCHER (persen/nominal) dan PROMO (persen/nominal). Punya expired date dan max uses. Tidak bisa dikombinasikan.

8. **Driver Earning**: Driver mendapat `shippingFee` setelah buyer konfirmasi delivery.

9. **Seller Earning**: Seller mendapat `subtotal - discountValue` setelah buyer konfirmasi delivery.

10. **Overdue SLA**: INSTANT = 1 hari, NEXT_DAY = 2 hari, REGULAR = 3 hari. Admin bisa simulasi lewat panel.

---

## Security Notes

| Lapisan | Implementasi |
|---|---|
| **XSS** | DOMPurify — semua input pengguna disanitasi sebelum di-render |
| **Input Validation** | Zod schemas untuk semua form (login, register, produk, alamat, diskon, review, ganti password) dengan pesan error Bahasa Indonesia |
| **Token Storage** | JWT disimpan di `localStorage`, dikirim via `Authorization: Bearer` header |
| **Token Expiry** | JWT di-decode dan dicek `exp` claim sebelum setiap request. Auto-redirect ke login jika expired. Auto-redirect pada response 401. |
| **Route Protection** | Role-based guards (`BuyerRoute`, `SellerRoute`, `DriverRoute`) mencegah akses tidak sah dari frontend |
| **Modal Logout** | Logout menghapus semua data auth dari localStorage |
| **API URL** | Bisa dikonfigurasi via env variable (`VITE_API_URL`) |

---

## Backend

Backend: [SEAPEDIA Backend](https://github.com/saputt/Seapedia-BE)

Dokumentasi API (Swagger): [saukiputraa-seapedia-be.hf.space/docs](https://saukiputraa-seapedia-be.hf.space/docs)
