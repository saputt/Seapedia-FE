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
        icon="✅"
        title="Berhasil"
        message="Produk berhasil ditambahkan!"
        actionLabel="Kembali"
        onAction={() => navigate("/dashboard/seller/products")}
      />
    </>
  );
};

export default ProductCreatePage;
