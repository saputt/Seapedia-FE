import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductDetail } from "../../../features/catalog/hooks/useProductDetail";
import { useUpdateProduct } from "../../../features/catalog/hooks/useProductMutations";
import AlertModal from "../../../shared/components/ui/AlertModal";
import ProductForm from "../../../features/catalog/components/ProductForm";
import Spinner from "../../../shared/components/ui/Spinner";
import { getReadableError } from "../../../shared/utils/errorMapper";

const ProductEditPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [successModal, setSuccessModal] = useState(false);

  const { data: product, isLoading } = useProductDetail(productId!) as any;
  const mutation = useUpdateProduct(productId!);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => navigate("/dashboard/seller/products")}
        className="inline-flex items-center gap-1 text-text-secondary hover:text-brand-deep transition-colors mb-4 font-medium"
      >
        &larr; Kembali
      </button>

      <h1 className="text-2xl font-bold text-text-primary mb-6">Edit Produk</h1>

      {mutation.isError && (
        <div className="mb-4 p-3 border-[3px] border-danger bg-danger/5">
          <p className="text-danger text-sm font-medium">{getReadableError(mutation.error)}</p>
        </div>
      )}

      <ProductForm
        initialData={product}
        onSubmit={async (data: any) => { mutation.mutate(data as any); }}
        isPending={mutation.isPending}
        submitLabel="Simpan"
        pendingLabel="Menyimpan..."
        onCancel={() => navigate("/dashboard/seller/products")}
      />

      <AlertModal
        isOpen={successModal}
        onClose={() => { setSuccessModal(false); navigate("/dashboard/seller/products"); }}
        icon="✅"
        title="Berhasil"
        message="Produk berhasil diperbarui!"
        actionLabel="Kembali"
        onAction={() => navigate("/dashboard/seller/products")}
      />
    </>
  );
};

export default ProductEditPage;
