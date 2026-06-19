import { useMyDriverJobs } from "../../../features/driver/hooks/useDriverJobs";
import { STATUS_LABEL, STATUS_COLOR, SHIPPING_LABEL } from "../../../shared/constants/order";
import Button from "../../../shared/components/ui/Button";
import Spinner from "../../../shared/components/ui/Spinner";

const DriverHistoryPage = () => {
  const { data: jobs = [], isLoading, error } = useMyDriverJobs();

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">Riwayat Pekerjaan</h1>
        <p className="text-sm text-text-muted mb-6">Riwayat pengiriman Anda</p>
        <div className="card text-center py-10">
          <p className="text-danger font-semibold mb-4">Gagal memuat riwayat.</p>
          <Button onClick={() => window.location.reload()} variant="primary" size="sm">
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-1">Riwayat Pekerjaan</h1>
      <p className="text-sm text-text-muted mb-6">Riwayat pengiriman Anda</p>

      {isLoading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="card text-center py-10">
          <p className="text-sm text-text-secondary">Belum ada riwayat pekerjaan.</p>
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
                <span className={`text-xs font-bold ${STATUS_COLOR[job.status] || "text-text-secondary"}`}>
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

              <div className="flex items-center gap-4 pt-3 border-t border-border text-sm">
                {job.driverJob?.earning > 0 && (
                  <div>
                    <p className="text-xs text-text-muted">Pendapatan</p>
                    <p className="font-semibold text-text-primary">
                      Rp{job.driverJob.earning.toLocaleString("id-ID")}
                    </p>
                  </div>
                )}
                {job.driverJob?.takenAt && (
                  <div>
                    <p className="text-xs text-text-muted">Diambil</p>
                    <p className="text-text-secondary">
                      {new Date(job.driverJob.takenAt).toLocaleDateString("id-ID", {
                        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                )}
                {job.driverJob?.doneAt && (
                  <div>
                    <p className="text-xs text-text-muted">Selesai</p>
                    <p className="text-text-secondary">
                      {new Date(job.driverJob.doneAt).toLocaleDateString("id-ID", {
                        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverHistoryPage;
