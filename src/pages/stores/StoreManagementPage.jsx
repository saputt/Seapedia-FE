import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMyStore } from "../../features/store/api/store.api";
import MainLayout from "../../shared/components/layout/MainLayout";

const StoreManagementPage = () => {
  const navigate = useNavigate();
  const { data: store, isLoading } = useQuery({
    queryKey: ["myStore"],
    queryFn: getMyStore,
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && !store) {
      navigate("/dashboard/seller/create-store", { replace: true });
    }
  }, [store, isLoading, navigate]);

  if (isLoading) {
    return (
      <MainLayout navbarVariant="default">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-[3px] border-brand-deep border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (!store) return null;

  return (
    <MainLayout navbarVariant="default">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="card !p-8">
          <h1 className="text-2xl font-bold text-text-primary mb-1">Toko Saya</h1>
          <p className="text-sm text-text-muted mb-6">Kelola toko Anda</p>

          <div className="space-y-4">
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
      </div>
    </MainLayout>
  );
};

export default StoreManagementPage;
