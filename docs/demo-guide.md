# Demo Guide

> Panduan menjelajahi fitur SEAPEDIA. Baca 5 menit, lalu praktik 10 menit.
> Waktu baca: 5 menit | Prioritas: Must Read

## Akun Demo

Semua akun dibuat oleh `prisma/seed.ts:260-313`.

| Role | Email | Password | Wallet Awal |
|------|-------|----------|-------------|
| Admin | `admin@seapedia.com` | `admin123` | — |
| Buyer | `buyer@seapedia.com` | `buyer123` | Rp500.000 |
| Seller | `seller@seapedia.com` | `seller123` | Rp5.000.000 |
| Driver | `driver@seapedia.com` | `driver123` | Rp200.000 |
| Multi Role | `multirole@seapedia.com` | `multirole123` | Rp1.000.000 |

Seed juga mencakup: 2 toko ("Toko Seapedia" + "Toko Multi Role"), 210+ produk (5 kategori), 5 kode diskon, 14 sample order.

## Skenario 1: Buyer (5 menit)

1. Login sebagai `buyer@seapedia.com`
2. Browse produk di halaman utama — filter kategori, cari produk
3. Klik produk → lihat detail, review, rating, sold count
4. Tambahkan ke cart
5. Buka cart → ubah quantity
6. Checkout:
   - Pilih alamat (buat jika belum ada)
   - Pilih shipping method (REGULAR/INSTANT/NEXT_DAY)
   - Masukkan kode diskon `HEMAT10` (10% off)
   - Lihat summary: subtotal, diskon, ongkir, PPN 12%, total
   - Konfirmasi checkout
7. Buka Orders → lihat order dengan status PENDING
8. **Catatan**: Tunggu seller memproses, atau login sebagai seller untuk memproses

## Skenario 2: Seller (5 menit)

1. Login sebagai `seller@seapedia.com`
2. Dashboard: lihat revenue chart, order status donut, top products
3. Manage Store → edit deskripsi/gambar toko
4. Products → tambah produk baru (pilih kategori, harga, stock)
5. Orders → lihat order masuk → klik **Proses** (PENDING → READY_FOR_DELIVERY)
6. Ratings → lihat review dari pembeli

## Skenario 3: Driver (5 menit)

1. Login sebagai `driver@seapedia.com`
2. Dashboard → lihat statistik
3. Available Jobs → lihat order yang siap diantar → **Take Job**
4. Jobs → update status: **Pick Up** (READY_FOR_DELIVERY → ON_DELIVERY)
5. Delivery Done → tandai selesai (ON_DELIVERY → DELIVERED)
6. History → lihat riwayat pengiriman
7. Income → lihat pendapatan (shipping fee)

## Skenario 4: Admin (5 menit)

1. Login sebagai `admin@seapedia.com`
2. Dashboard: lihat total users, stores, products, orders, drivers
3. Users → lihat daftar, filter
4. Stores → toggle aktif/non-aktif toko (dengan alasan)
5. Products → toggle sembunyikan produk
6. Drivers → toggle suspend driver
7. Orders → lihat semua order, filter by status
8. Discounts → buat/edit/hapus kode diskon
9. **Simulasi Overdue**:
   - Skip waktu (1-365 hari) → proses overdue order
   - Order PENDING/READY_FOR_DELIVERY yang melebihi SLA akan di-cancel + refund
   - Reset simulasi untuk kembali ke real time

## Skenario 5: Multi Role (2 menit)

1. Login sebagai `multirole@seapedia.com`
2. Awal: BUYER → beli produk
3. Buka halaman store → buat toko → otomatis dapat SELLER role
4. Switch role ke SELLER → dashboard seller → lihat order
5. Switch role ke DRIVER → dashboard driver → available jobs

## Catatan Demo

- **Simulasi tidak persist**: Admin simulation reset saat server restart (`admin.service.ts:27`, in-memory `simulatedTimeOffsetMs`)
- **Double-spend protection**: Order token berlaku 5 menit (`order-checkout.service.ts:58`). In-memory dedup 10 menit (`order-checkout.service.ts:198-209`). **Server restart menghapus dedup cache.**
- **Store isActive**: Tidak ada pengecekan `store.isActive` di checkout — store bisa non-aktif tapi order tetap bisa dibuat.
- **Hidden product**: Produk di-hidden admin tetap ada di cart; error muncul saat checkout/summary.

---

**Related:**
- [Business Rules](https://github.com/saputt/Seapedia-BE/blob/main/docs/business-rules.md) — aturan bisnis detail
- [Checkout Flow](https://github.com/saputt/Seapedia-BE/blob/main/docs/checkout-flow.md) — detail 2-step checkout
- [Order Lifecycle](https://github.com/saputt/Seapedia-BE/blob/main/docs/order-lifecycle.md) — state machine

**Back to:** [README](../README.md)
