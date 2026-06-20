import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductById, updateProduct } from "../../../features/catalog/api/catalog.api";
import { apiFetch } from "../../../api/client";
import AlertModal from "../../../shared/components/ui/AlertModal";
import ProductForm from "../../../features/catalog/components/ProductForm";
import Spinner from "../../../shared/components/ui/Spinner";
import { getReadableError } from "../../../shared/utils/errorMapper";

const ProductEditPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [successModal, setSuccessModal] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId,
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (data instanceof FormData) {
        return apiFetch(`products/${productId}`, {
          method: "PUT",
          body: data,
        });
      }
      return updateProduct(productId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerProducts"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      setSuccessModal(true);
    },
  });

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
        onSubmit={(data) => mutation.mutate(data)}
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
