import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMyStore } from "../../../features/store/hooks/useMyStore";
import { useUpdateStore } from "../../../features/store/hooks/useUpdateStore";
import { getReadableError } from "../../../shared/utils/errorMapper";

const StoreManagement = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");

  const { data: store, isLoading, isFetching } = useMyStore();

  const updateMutation = useUpdateStore();

  useEffect(() => {
    if (!isLoading && !isFetching && !store) {
      navigate("/dashboard/seller/create-store", { replace: true });
    }
  }, [store, isLoading, isFetching, navigate]);

  const startEditing = () => {
    setStoreName(store.storeName);
    setDescription(store.description);
    setIsEditing(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!storeName.trim() || !description.trim()) return;
    updateMutation.mutate(
      { storeId: store.id, data: { storeName: storeName.trim(), description: description.trim() } },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-[3px] border-brand-deep border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!store) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Manajemen Toko</h1>
          <p className="text-sm text-text-muted">Kelola informasi toko Anda</p>
        </div>
        {!isEditing && (
          <button onClick={startEditing} className="btn-primary text-sm !py-2 !px-4">
            Edit Toko
          </button>
        )}
      </div>

      {updateMutation.isError && (
        <div className="mb-6 p-4 border-[3px] border-danger bg-danger/5">
          <p className="text-danger text-sm font-medium">{getReadableError(updateMutation.error)}</p>
        </div>
      )}

      {updateMutation.isSuccess && !isEditing && (
        <div className="mb-6 p-4 border-[3px] border-success bg-success/5">
          <p className="text-success text-sm font-semibold">Toko berhasil diperbarui!</p>
        </div>
      )}

      {isEditing ? (
        <div className="card !p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-text-secondary font-medium text-sm mb-1.5">Nama Toko</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="input-neo w-full"
                required
              />
            </div>
            <div>
              <label className="block text-text-secondary font-medium text-sm mb-1.5">Deskripsi Toko</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-neo w-full resize-none h-28"
                required
              />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setIsEditing(false)} className="btn-ghost flex-1 !py-3">
                Batal
              </button>
              <button
                type="submit"
                className="btn-primary flex-1 !py-3 flex items-center justify-center gap-2"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Menyimpan...</>
                ) : (
                  "Simpan"
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card !p-8">
          <div className="space-y-5">
            <div>
              <p className="text-sm text-text-muted">Nama Toko</p>
              <p className="text-lg font-semibold text-text-primary">{store.storeName}</p>
            </div>
            <div>
              <p className="text-sm text-text-muted">Deskripsi</p>
              <p className="text-text-secondary">{store.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreManagement;
