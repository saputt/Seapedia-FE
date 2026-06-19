import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress } from "../../../features/order/api/order.api";
import Button from "../../../shared/components/ui/Button";
import Spinner from "../../../shared/components/ui/Spinner";
import AlertModal from "../../../shared/components/ui/AlertModal";
import { getReadableError } from "../../../shared/utils/errorMapper";

const AddressFormModal = ({ address, onClose, onSuccess }) => {
  const isEdit = !!address;
  const [label, setLabel] = useState(address?.label || "");
  const [completeAddress, setCompleteAddress] = useState(address?.completeAddress || "");

  const mutation = useMutation({
    mutationFn: async (dto) => {
      if (isEdit) return updateAddress(address.id, dto);
      return createAddress(dto);
    },
    onSuccess,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ label: label.trim(), completeAddress: completeAddress.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="card !p-6 mx-4 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-primary">{isEdit ? "Edit Alamat" : "Tambah Alamat"}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary text-xl leading-none">&times;</button>
        </div>

        {mutation.isError && (
          <div className="mb-4 p-3 border-[3px] border-danger bg-danger/5">
            <p className="text-danger text-sm font-medium">{getReadableError(mutation.error)}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-text-secondary font-medium text-sm mb-1">Label</label>
            <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} className="input-neo w-full" placeholder="Rumah, Kantor, dll" required />
          </div>
          <div>
            <label className="block text-text-secondary font-medium text-sm mb-1">Alamat Lengkap</label>
            <textarea value={completeAddress} onChange={(e) => setCompleteAddress(e.target.value)} className="input-neo w-full resize-none h-24" placeholder="Jl. Contoh No. 123, Kecamatan, Kota, Provinsi, Kode Pos" required />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" onClick={onClose} variant="ghost" fullWidth>Batal</Button>
            <Button type="submit" variant="primary" fullWidth loading={mutation.isPending}>
              {mutation.isPending ? "Menyimpan..." : (isEdit ? "Simpan" : "Tambah")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddressPage = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: addresses, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: fetchAddresses,
  });

  const defaultMutation = useMutation({
    mutationFn: setDefaultAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setDeleteTarget(null);
    },
  });

  return (
    <>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-text-primary">Alamat Saya</h1>
        <Button onClick={() => { setEditingAddress(null); setShowForm(true); }} variant="primary">
          + Tambah Alamat
        </Button>
      </div>
      <p className="text-sm text-text-muted mb-6">Kelola alamat pengiriman Anda</p>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {!isLoading && (!addresses || addresses.length === 0) && (
        <div className="card !p-8 text-center">
          <p className="text-text-muted">Belum ada alamat tersimpan.</p>
        </div>
      )}

      {!isLoading && addresses && addresses.length > 0 && (
        <div className="grid gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-text-primary">{addr.label}</span>
                    {addr.lastUsed && (
                      <span className="text-[10px] bg-brand-deep text-white font-semibold px-2 py-0.5 rounded">Utama</span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                    {addr.completeAddress}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!addr.lastUsed && (
                    <Button
                      onClick={() => defaultMutation.mutate(addr.id)}
                      variant="ghost"
                      size="sm"
                    >
                      Jadikan Utama
                    </Button>
                  )}
                  <Button
                    onClick={() => { setEditingAddress(addr); setShowForm(true); }}
                    variant="ghost"
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => setDeleteTarget(addr)}
                    variant="danger"
                    size="sm"
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <AddressFormModal
          address={editingAddress}
          onClose={() => { setShowForm(false); setEditingAddress(null); }}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
            setShowForm(false);
            setEditingAddress(null);
          }}
        />
      )}

      <AlertModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        icon="🗑️"
        title="Hapus Alamat"
        message={`Yakin ingin menghapus alamat "${deleteTarget?.label}"?`}
        actionLabel="Hapus"
        onAction={() => deleteMutation.mutate(deleteTarget.id)}
      />
    </>
  );
};

export default AddressPage;