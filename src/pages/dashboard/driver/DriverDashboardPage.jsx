import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useMyDriverJobs } from "../../../features/driver/hooks/useDriverJobs";
import { useWallet } from "../../../features/wallet/hooks/useWallet";
import Spinner from "../../../shared/components/ui/Spinner";
import StatCard from "../../../shared/components/ui/StatCard";

const DriverDashboardPage = () => {
  const { data: jobs = [], isLoading } = useMyDriverJobs();
  const { data: wallet } = useWallet();

  const stats = useMemo(() => {
    const onDelivery = jobs.filter((j) => j.status === "ON_DELIVERY").length;
    const delivered = jobs.filter((j) => j.status === "DELIVERED").length;
    const totalEarnings = jobs
      .filter((j) => j.status === "DELIVERED")
      .reduce((sum, j) => sum + (j.driverJob?.earning || 0), 0);

    return { onDelivery, delivered, totalEarnings, activeJob: jobs.find((j) => j.status === "ON_DELIVERY") };
  }, [jobs]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-text-primary mb-1">Dashboard</h1>
      <p className="text-sm text-text-muted mb-8">Ringkasan aktivitas kurir Anda</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard label="Pengiriman Aktif" value={stats.onDelivery} variant="badge" color="bg-info" />
        <StatCard label="Pesanan Selesai" value={stats.delivered} variant="badge" color="bg-success" />
        <StatCard label="Saldo Dompet" value={`Rp${(wallet?.balance || 0).toLocaleString("id-ID")}`} variant="badge" color="bg-brand-deep" />
      </div>

      {stats.activeJob && (
        <div className="card !p-5 border-l-[4px] border-info">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-text-primary">Pengiriman Aktif</p>
              <p className="text-sm text-text-muted mt-1">
                Pesanan #{stats.activeJob.id.slice(0, 8)} sedang dalam pengiriman
              </p>
            </div>
            <Link to="/dashboard/driver/history" className="btn-primary text-sm !py-2 !px-4 inline-block">
              Lihat Detail
            </Link>
          </div>
        </div>
      )}

      {stats.onDelivery === 0 && (
        <div className="card !p-5 border-l-[4px] border-warning">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-text-primary">Tidak Ada Pengiriman Aktif</p>
              <p className="text-sm text-text-muted mt-1">
                Ambil pekerjaan baru yang tersedia
              </p>
            </div>
            <Link to="/dashboard/driver/jobs" className="btn-primary text-sm !py-2 !px-4 inline-block">
              Cari Pekerjaan
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default DriverDashboardPage;
