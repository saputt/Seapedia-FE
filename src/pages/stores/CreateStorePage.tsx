import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../shared/components/layout/MainLayout";
import Spinner from "../../shared/components/ui/Spinner";
import { useCreateStore } from "../../features/store/hooks/useCreateStore";
import { useMyStore } from "../../features/store/hooks/useMyStore";
import { getReadableError } from "../../shared/utils/errorMapper";
import { StoreForm } from "@/features/store/components/StoreForm";
import type { StoreInput } from "@/shared/validations";

const CreateStorePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: store, isLoading } = useMyStore();

  useEffect(() => {
    if (!isLoading && store) {
      navigate("/dashboard/seller", { replace: true });
    }
  }, [store, isLoading, navigate]);

  const createStoreMutation = useCreateStore();

  const onSubmitForm = (data: StoreInput) => {
    createStoreMutation.mutate({ storeName: data.name.trim(), description: data.description.trim(), address: data.address?.trim() });
  };

  if (isLoading) {
    return (
      <MainLayout navbarVariant="default">
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size="lg" />
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

          <StoreForm
            onSubmit={onSubmitForm}
            isPending={createStoreMutation.isPending}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateStorePage;
