# SEAPEDIA — Frontend

> E-commerce platform dengan multi-role system (Buyer, Seller, Driver, Admin). Frontend SPA.

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | React 19, TypeScript 6 |
| Build | Vite 8, `@vitejs/plugin-react` |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Server state | TanStack React Query v5 (staleTime: 5m, retry: 1, refetchOnWindowFocus: false) |
| Client state | Zustand v5 — hanya untuk auth + cart badge |
| Routing | React Router v7 — lazy loading via `lazy()` + Suspense |
| Forms | react-hook-form v7 + zod v4 |
| HTTP | Native `fetch` (no Axios). Lihat `api/client.ts` |
| Storage | localStorage untuk token, user, roles, activeRole |
| Sanitization | DOMPurify — `shared/utils/sanitize.ts` |
| Charts | Recharts v3 — seller dashboard |
| Testing | Vitest + React Testing Library — `test/Button.test.tsx` |

## State Management Boundary

| Concern | Tools | Files |
|---------|-------|-------|
| Auth state (token, user, roles, activeRole) | Zustand + localStorage | `features/auth/store/authStore.ts` |
| Cart UI (items, badge) | Zustand | `features/cart/store/cartStore.ts` |
| All server data (products, orders, wallet, etc.) | React Query | `shared/lib/queryClient.ts` |
| Optimistic updates | React Query `onMutate` / `onError` / `onSettled` | `useWallet.ts`, `useOrders.ts`, `useCartMutations.ts` |

## Quick Start

```bash
npm install
npm run dev          # http://localhost:5173
```

## Environment

| Variable | Required | Default | Used In |
|----------|----------|---------|---------|
| `VITE_API_URL` | No | `http://localhost:3000/api/` | `api/client.ts:3` |

## API Client Pattern

Native `fetch` wrapper (`api/client.ts:36`). Auto-attaches JWT from localStorage as Bearer token. FormData bodies skip Content-Type header (browser sets boundary). 401 responses trigger redirect to `/auth/login`.

Optimistic updates implemented in all mutations: save snapshot in `onMutate`, rollback in `onError`, invalidate in `onSettled`.

---

## ⚡ Quick Reference (30 detik)

- **Project**: SEAPEDIA — E-commerce multi-role (Buyer, Seller, Driver, Admin)
- **Demo Guide**: `docs/demo-guide.md`
- **Business Rules**: `Backend/docs/business-rules.md`
- **ADR**: `Backend/docs/architecture-decision-record.md`
- **Deployed FE**: [seapedia-nine.vercel.app](https://seapedia-nine.vercel.app)
- **Deployed API**: [saukiputraa-seapedia-be.hf.space](https://saukiputraa-seapedia-be.hf.space)
- **Swagger**: [saukiputraa-seapedia-be.hf.space/docs](https://saukiputraa-seapedia-be.hf.space/docs)

---

**Related:**
- [Demo Guide](./docs/demo-guide.md)
- [Backend README](../Backend/README.md)

**Back to:** [Project Root](../README.md)
