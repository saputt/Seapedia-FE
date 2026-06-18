import { useAvailableJobs, useTakeJob } from "../../../features/driver/hooks/useDriverJobs";
import { STATUS_LABEL, SHIPPING_LABEL } from "../../../shared/constants/order";

const DriverJobsPage = () => {
  const { data: jobs = [], isLoading, error } = useAvailableJobs();
  const takeJobMutation = useTakeJob();

  const handleTakeJob = (orderId) => {
    if (takeJobMutation.isPending) return;
    takeJobMutation.mutate(orderId);
  };

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">Pekerjaan Tersedia</h1>
        <p className="text-sm text-text-muted mb-6">Cari pesanan yang siap dikirim</p>
        <div className="card text-center py-10">
          <p className="text-danger font-semibold mb-4">Gagal memuat pekerjaan.</p>
          <button onClick={() => window.location.reload()} className="btn-primary text-sm !py-2 !px-6">
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-1">Pekerjaan Tersedia</h1>
      <p className="text-sm text-text-muted mb-6">Cari pesanan yang siap dikirim</p>

      {takeJobMutation.isSuccess && (
        <div className="card !p-4 mb-6 border-success">
          <p className="text-success font-semibold text-sm">
            Pekerjaan berhasil diambil! Silakan cek riwayat untuk detail pengiriman.
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

      {isLoading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-[3px] border-brand-deep border-t-transparent rounded-full animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="card text-center py-10">
          <p className="text-sm text-text-secondary">Tidak ada pekerjaan tersedia saat ini.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
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
                  {STATUS_LABEL[job.status] || job.status}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-text-primary">{job.store?.storeName || "Toko"}</span>
                {job.shippingMethod && (
                  <span className="text-xs bg-brand-subtle text-text-secondary px-2 py-0.5 rounded">
                    {SHIPPING_LABEL[job.shippingMethod] || job.shippingMethod}
                  </span>
                )}
              </div>

              <div className="space-y-2 mb-4">
                {job.orderItems?.slice(0, 3).map((item) => (
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
                <button
                  onClick={() => handleTakeJob(job.id)}
                  disabled={takeJobMutation.isPending}
                  className="btn-primary text-sm !py-2 !px-5"
                >
                  {takeJobMutation.isPending ? "Mengambil..." : "Ambil Pekerjaan"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverJobsPage;
