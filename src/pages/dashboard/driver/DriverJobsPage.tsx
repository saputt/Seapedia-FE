import React from "react";
import { useAvailableJobs, useMyDriverJobs, useTakeJob, useDeliveryDone } from "../../../features/driver/hooks/useDriverJobs";
import { STATUS_LABEL, SHIPPING_LABEL } from "../../../shared/constants/order";
import ErrorState from "../../../shared/components/ui/ErrorState";
import Spinner from "../../../shared/components/ui/Spinner";
import Button from "../../../shared/components/ui/Button";

const DriverJobsPage: React.FC = () => {
  const { data: myJobs = [] } = useMyDriverJobs() as any;
  const { data: availableJobs = [], isLoading: availableLoading, error: availableError } = useAvailableJobs() as any;
  const takeJobMutation = useTakeJob();
  const deliveryDoneMutation = useDeliveryDone();

  const activeJobs = myJobs.filter(
    (job: any) => job.status === "ON_DELIVERY" && !job.driverJob?.doneAt
  );

  const handleTakeJob = (orderId: string) => {
    if (takeJobMutation.isPending) return;
    takeJobMutation.mutate(orderId);
  };

  const handleDeliveryDone = (orderId: string) => {
    if (deliveryDoneMutation.isPending) return;
    deliveryDoneMutation.mutate(orderId);
  };

  const renderJobCard = (job: any, showTakeButton: boolean) => (
    <div key={job.id} className="card">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-text-muted">
            {new Date(job.createdAt).toLocaleDateString("id-ID", {
              day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
            })}
          </p>
          <p className="text-xs text-text-muted mt-0.5">#{job.id.slice(0, 8)}</p>
        </div>
        <span className={`text-xs font-bold text-info`}>
          {STATUS_LABEL[job.status as keyof typeof STATUS_LABEL] || job.status}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-medium text-text-primary">{job.store?.storeName || "Toko"}</span>
        {job.shippingMethod && (
          <span className="text-xs bg-brand-subtle text-text-secondary px-2 py-0.5 rounded">
            {SHIPPING_LABEL[job.shippingMethod as keyof typeof SHIPPING_LABEL] || job.shippingMethod}
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4">
        {job.orderItems?.slice(0, 3).map((item: any) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-brand-subtle flex-shrink-0 overflow-hidden">
              <img
                src={item.product?.imageUrl || "/placeholder.png"}
                alt={item.product?.name || "Product"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {item.product?.name || "Produk"}
              </p>
              <p className="text-xs text-text-muted">
                {item.quantity}x @ Rp{item.price?.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        ))}
        {job.orderItems?.length > 3 && (
          <p className="text-xs text-text-muted">+{job.orderItems.length - 3} item lainnya</p>
        )}
      </div>

      {job.address && (
        <div className="mb-4 p-3 bg-brand-subtle/30 rounded-lg">
          <p className="text-xs font-semibold text-text-muted mb-1">Alamat Pengiriman</p>
          <p className="text-sm text-text-secondary">
            {job.address.label && <span className="font-medium text-text-primary">{job.address.label}</span>}
            {job.address.label && <br />}
            {job.address.completeAddress}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div>
          <p className="text-xs text-text-muted">Ongkos Kirim</p>
          <p className="text-sm font-bold text-text-primary">
            Rp{job.shippingFee?.toLocaleString("id-ID")}
          </p>
        </div>
        {showTakeButton ? (
          <Button
            onClick={() => handleTakeJob(job.id)}
            variant="primary"
            loading={takeJobMutation.isPending}
          >
            {takeJobMutation.isPending ? "Mengambil..." : "Ambil Pekerjaan"}
          </Button>
        ) : (
          <Button
            onClick={() => handleDeliveryDone(job.id)}
            variant="primary"
            loading={deliveryDoneMutation.isPending}
          >
            {deliveryDoneMutation.isPending ? "Memproses..." : "Selesai"}
          </Button>
        )}
      </div>
    </div>
  );

  if (availableError && !activeJobs.length) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">Pekerjaan</h1>
        <p className="text-sm text-text-muted mb-6">Kelola pengiriman Anda</p>
        <ErrorState message="Gagal memuat pekerjaan." onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-1">Pekerjaan</h1>
      <p className="text-sm text-text-muted mb-6">Kelola pengiriman Anda</p>

      {takeJobMutation.isSuccess && (
        <div className="card !p-4 mb-6 border-success">
          <p className="text-success font-semibold text-sm">
            Pekerjaan berhasil diambil! Silakan lakukan pengiriman.
          </p>
        </div>
      )}

      {takeJobMutation.isError && (
        <div className="card !p-4 mb-6 border-danger">
          <p className="text-danger font-semibold text-sm">
            {takeJobMutation.error?.message || "Gagal mengambil pekerjaan."}
          </p>
        </div>
      )}

      {deliveryDoneMutation.isSuccess && (
        <div className="card !p-4 mb-6 border-success">
          <p className="text-success font-semibold text-sm">
            Pengiriman ditandai selesai! Menunggu konfirmasi pembeli.
          </p>
        </div>
      )}

      {deliveryDoneMutation.isError && (
        <div className="card !p-4 mb-6 border-danger">
          <p className="text-danger font-semibold text-sm">
            {deliveryDoneMutation.error?.message || "Gagal menandai selesai."}
          </p>
        </div>
      )}

      {activeJobs.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-text-primary mb-3">Pengiriman Aktif</h2>
          <div className="space-y-4 mb-8">
            {activeJobs.map((job: any) => renderJobCard(job, false))}
          </div>
        </>
      )}

      <h2 className="text-lg font-semibold text-text-primary mb-3">Pekerjaan Tersedia</h2>

      {availableLoading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : availableJobs.length === 0 ? (
        <div className="card text-center py-10">
          <p className="text-sm text-text-secondary">Tidak ada pekerjaan tersedia saat ini.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {availableJobs.map((job: any) => renderJobCard(job, true))}
        </div>
      )}
    </div>
  );
};

export default DriverJobsPage;
