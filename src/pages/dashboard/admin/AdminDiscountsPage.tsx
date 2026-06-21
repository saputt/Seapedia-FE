import React from "react";
import { useState } from "react";
import Button from "../../../shared/components/ui/Button";
import Spinner from "../../../shared/components/ui/Spinner";
import DiscountForm from "../../../features/discount/components/DiscountForm";
import { useDiscounts, useCreateDiscount, useDeleteDiscount } from "../../../features/discount/hooks/useDiscounts";
import { Discount } from "../../../types";

const TABS = [
  { key: "all", label: "Semua" },
  { key: "PROMO", label: "Promo" },
  { key: "VOUCHER", label: "Voucher" },
];

const AdminDiscountsPage: React.FC = () => {
  const [tab, setTab] = useState("all");
  const [showCreate, setShowCreate] = useState(false);

  const { data: discounts, isLoading, error, refetch } = useDiscounts();
  const createMutation = useCreateDiscount();
  const deleteMutation = useDeleteDiscount();

  const list = discounts ?? [];
  const filtered = tab === "all" ? list : list.filter((d: Discount) => d.type === tab);

  const handleCreate = (data: any) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setShowCreate(false);
      },
    });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Hapus diskon ini?")) return;
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-text-primary">Kelola Diskon</h1>
        <Button onClick={() => setShowCreate(true)} variant="primary">
          + Buat Diskon
        </Button>
      </div>
      <p className="text-sm text-text-muted mb-6">Atur kode promo dan voucher untuk pengguna</p>

      {error && (
        <div className="card mb-4">
          <p className="text-danger text-sm">{error?.message || "Gagal memuat data"}</p>
          <Button onClick={() => refetch()} variant="ghost" className="mt-2">
            Coba Lagi
          </Button>
        </div>
      )}

      {showCreate && (
        <DiscountForm
          onSubmit={handleCreate}
          isPending={createMutation.isPending}
          onCancel={() => setShowCreate(false)}
        />
      )}

      <div className="card">
        <div className="flex items-center gap-1 mb-4 border-b-2 border-border pb-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`text-sm font-semibold !py-1.5 !px-4 rounded transition-colors ${
                tab === t.key ? "bg-brand-deep text-white" : "text-text-secondary hover:text-brand-deep"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-text-secondary text-center py-6">Belum ada diskon.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-border text-left text-text-muted">
                  <th className="pb-2 pr-4 font-semibold">Kode</th>
                  <th className="pb-2 pr-4 font-semibold">Tipe</th>
                  <th className="pb-2 pr-4 font-semibold">Nilai</th>
                  <th className="pb-2 pr-4 font-semibold">Dipakai</th>
                  <th className="pb-2 pr-4 font-semibold">Maks</th>
                  <th className="pb-2 pr-4 font-semibold">Berakhir</th>
                  <th className="pb-2 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d: any) => (
                  <tr key={d.id} className="border-b border-border hover:bg-brand-subtle transition-colors">
                    <td className="py-2.5 pr-4 font-mono font-medium text-text-primary">{d.code}</td>
                    <td className="py-2.5 pr-4">
                      <span className={`text-xs font-bold ${d.type === "PROMO" ? "text-warning" : "text-info"}`}>
                        {d.type}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-text-secondary">
                      {d.isPercent ? `${d.value}%` : `Rp${d.value?.toLocaleString("id-ID")}`}
                    </td>
                    <td className="py-2.5 pr-4 text-text-primary font-medium">{d.usedCount}</td>
                    <td className="py-2.5 pr-4 text-text-secondary">{d.maxUses ?? "∞"}</td>
                    <td className="py-2.5 pr-4 text-text-muted text-xs">
                      {new Date(d.expiredAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="py-2.5">
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="text-danger font-semibold text-xs hover:underline"
                      >
                        {deleteMutation.isPending ? "..." : "Hapus"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDiscountsPage;
