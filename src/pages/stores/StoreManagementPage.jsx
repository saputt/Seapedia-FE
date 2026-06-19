import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "../../shared/components/ui/Button";
import { getMyStore, updateStore } from "../../features/store/api/store.api";
import { getReadableError } from "../../shared/utils/errorMapper";
import Spinner from "../../shared/components/ui/Spinner";

const StoreManagementPage = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");

  const { data: store, isLoading } = useQuery({
    queryKey: ["myStore"],
    queryFn: getMyStore,
    retry: false,
  });

  const updateMutation = useMutation({
    mutationFn: () => updateStore(store.id, { storeName: storeName.trim(), description: description.trim() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myStore"] });
      setIsEditing(false);
    },
  });

  const startEditing = () => {
    setStoreName(store.storeName);
    setDescription(store.description);
    setIsEditing(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!store) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Toko Saya</h1>
          <p className="text-sm text-text-muted">Kelola informasi toko Anda</p>
        </div>
        {!isEditing && (
          <Button onClick={startEditing} variant="primary">
            Edit Toko
          </Button>
        )}
      </div>

      {updateMutation.isError && (
        <div className="mb-6 p-4 border-[3px] border-danger bg-danger/5">
          <p className="text-danger text-sm font-medium">{getReadableError(updateMutation.error)}</p>
        </div>
      )}

      {updateMutation.isSuccess && (
        <div className="mb-6 p-4 border-[3px] border-success bg-success/5">
          <p className="text-success text-sm font-semibold">Toko berhasil diperbarui!</p>
        </div>
      )}

      {isEditing ? (
        <div className="card !p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!storeName.trim() || !description.trim()) return;
              updateMutation.mutate();
            }}
            className="space-y-5"
          >
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
              <Button type="button" onClick={() => setIsEditing(false)} variant="ghost" size="lg" fullWidth>
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Menyimpan..." : "Simpan"}
              </Button>
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

export default StoreManagementPage;
