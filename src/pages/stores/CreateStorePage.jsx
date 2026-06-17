import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "../../shared/components/layout/MainLayout";
import { useCreateStore } from "../../features/store/hooks/useCreateStore";
import { getMyStore } from "../../features/store/api/store.api";
import { getReadableError } from "../../shared/utils/errorMapper";

const CreateStorePage = () => {
  const navigate = useNavigate();
  const { data: store, isLoading } = useQuery({
    queryKey: ["myStore"],
    queryFn: getMyStore,
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && store) {
      navigate("/dashboard/seller", { replace: true });
    }
  }, [store, isLoading, navigate]);

  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const createStoreMutation = useCreateStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!storeName.trim() || !description.trim()) return;
    createStoreMutation.mutate({ storeName: storeName.trim(), description: description.trim() });
  };

  if (isLoading) {
    return (
      <MainLayout navbarVariant="default">
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-[3px] border-brand-deep border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout navbarVariant="default">
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="card !p-8">
          <h1 className="text-2xl font-bold text-text-primary mb-1">Buka Toko</h1>
          <p className="text-sm text-text-muted mb-6">
            Mulai jualan dengan membuat toko Anda sendiri
          </p>

          {createStoreMutation.isError && (
            <div className="mb-6 p-4 border-[3px] border-danger bg-danger/5">
              <p className="text-danger text-sm font-medium">
                {getReadableError(createStoreMutation.error)}
              </p>
            </div>
          )}

          {createStoreMutation.isSuccess && (
            <div className="mb-6 p-4 border-[3px] border-success bg-success/5">
              <p className="text-success text-sm font-semibold">
                Toko berhasil dibuat! Mengarahkan ke dashboard...
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-text-secondary font-medium text-sm mb-1.5">
                Nama Toko
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="input-neo w-full"
                placeholder="cth: Toko Sejahtera"
                required
              />
            </div>

            <div>
              <label className="block text-text-secondary font-medium text-sm mb-1.5">
                Deskripsi Toko
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-neo w-full resize-none h-28"
                placeholder="Ceritakan tentang toko Anda..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-ghost flex-1 !py-3"
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn-primary flex-1 !py-3 flex items-center justify-center gap-2"
                disabled={createStoreMutation.isPending}
              >
                {createStoreMutation.isPending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Membuat...
                  </>
                ) : (
                  "Buat Toko"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateStorePage;
