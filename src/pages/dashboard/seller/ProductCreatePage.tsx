import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMyStore } from "../../../features/store/hooks/useMyStore";
import { useCreateProduct } from "../../../features/catalog/hooks/useProductMutations";
import AlertModal from "../../../shared/components/ui/AlertModal";
import ProductForm from "../../../features/catalog/components/ProductForm";
import { getReadableError } from "../../../shared/utils/errorMapper";

const ProductCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [successModal, setSuccessModal] = useState(false);

  const { data: store } = useMyStore() as any;
  const mutation = useCreateProduct();

  const handleSubmit = async (data: any) => {
    mutation.mutate(
      { storeId: store.id, data } as any,
      { onSuccess: () => setSuccessModal(true) }
    );
  };

  return (
    <>
      <button
        onClick={() => navigate("/dashboard/seller/products")}
        className="inline-flex items-center gap-1 text-text-secondary hover:text-brand-deep transition-colors mb-4 font-medium"
      >
        &larr; Kembali
      </button>

      <h1 className="text-2xl font-bold text-text-primary mb-6">Tambah Produk</h1>

      {mutation.isError && (
        <div className="mb-4 p-3 border-[3px] border-danger bg-danger/5">
          <p className="text-danger text-sm font-medium">{getReadableError(mutation.error)}</p>
        </div>
      )}

      <ProductForm
        onSubmit={handleSubmit}
        isPending={mutation.isPending}
        submitLabel="Tambah"
        pendingLabel="Menambah..."
        onCancel={() => navigate("/dashboard/seller/products")}
      />

      <AlertModal
        isOpen={successModal}
        onClose={() => { setSuccessModal(false); navigate("/dashboard/seller/products"); }}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        }
        title="Berhasil"
        message="Produk berhasil ditambahkan!"
        actionLabel="Kembali"
        onAction={() => navigate("/dashboard/seller/products")}
      />
    </>
  );
};

export default ProductCreatePage;
