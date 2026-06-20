import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createProduct } from "../../../features/catalog/api/catalog.api";
import { apiFetch } from "../../../api/client";
import AlertModal from "../../../shared/components/ui/AlertModal";
import ProductForm from "../../../features/catalog/components/ProductForm";
import { getReadableError } from "../../../shared/utils/errorMapper";
import { getMyStore } from "../../../features/store/api/store.api";

const ProductCreatePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [successModal, setSuccessModal] = useState(false);

  const { data: store } = useQuery({
    queryKey: ["myStore"],
    queryFn: getMyStore,
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (data instanceof FormData) {
        return apiFetch(`products/${store.id}`, {
          method: "POST",
          body: data,
        });
      }
      return createProduct(store.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerProducts"] });
      setSuccessModal(true);
    },
  });

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
        onSubmit={(data) => mutation.mutate(data)}
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
