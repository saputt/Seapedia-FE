import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useMyDriverJobs, useAvailableJobs } from "../../../features/driver/hooks/useDriverJobs";
import { useWallet } from "../../../features/wallet/hooks/useWallet";
import Spinner from "../../../shared/components/ui/Spinner";
import StatCard from "../../../shared/components/ui/StatCard";
import { SHIPPING_LABEL } from "../../../shared/constants/order";

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  return new Date(dateStr).toLocaleDateString("id-ID");
}

const DriverDashboardPage: React.FC = () => {
  const { data: jobs = [], isLoading } = useMyDriverJobs() as any;
  const { data: wallet } = useWallet() as any;
  const { data: availableJobs } = useAvailableJobs() as any;

  const stats = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).getTime();

    const onDelivery = jobs.filter((j: any) => j.status === "ON_DELIVERY");
    const delivered = jobs.filter((j: any) => j.status === "DELIVERED");

    const todayDelivered = delivered.filter((j: any) => {
      const doneAt = j.driverJob?.doneAt ? new Date(j.driverJob.doneAt).getTime() : 0;
      return doneAt >= todayStart;
    });

    const weekDelivered = delivered.filter((j: any) => {
      const doneAt = j.driverJob?.doneAt ? new Date(j.driverJob.doneAt).getTime() : 0;
      return doneAt >= weekStart;
    });

    const totalEarnings = delivered.reduce((sum: number, j: any) => sum + (j.driverJob?.earning || 0), 0);
    const weekEarnings = weekDelivered.reduce((sum: number, j: any) => sum + (j.driverJob?.earning || 0), 0);

    const deliveryTimes = delivered
      .filter((j: any) => j.driverJob?.takenAt && j.driverJob?.doneAt)
      .map((j: any) => {
        const takenAt = new Date(j.driverJob.takenAt).getTime();
        const doneAt = new Date(j.driverJob.doneAt).getTime();
        return (doneAt - takenAt) / (1000 * 60);
      });
    const avgDeliveryTime = deliveryTimes.length > 0
      ? deliveryTimes.reduce((a: number, b: number) => a + b, 0) / deliveryTimes.length
      : 0;

    const methodBreakdown = jobs.reduce((acc: Record<string, number>, j: any) => {
      const method = j.shippingMethod || "UNKNOWN";
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentDeliveries = [...delivered]
      .sort((a: any, b: any) => {
        const aDone = a.driverJob?.doneAt ? new Date(a.driverJob.doneAt).getTime() : 0;
        const bDone = b.driverJob?.doneAt ? new Date(b.driverJob.doneAt).getTime() : 0;
        return bDone - aDone;
      })
      .slice(0, 5);

    return {
      onDelivery: onDelivery.length,
      delivered: delivered.length,
      todayDelivered: todayDelivered.length,
      weekDelivered: weekDelivered.length,
      totalEarnings,
      weekEarnings,
      avgEarnings: delivered.length > 0 ? totalEarnings / delivered.length : 0,
      avgDeliveryTime,
      methodBreakdown,
      recentDeliveries,
      activeJob: onDelivery[0] ?? null,
      availableCount: availableJobs?.length ?? 0,
    };
  }, [jobs, availableJobs]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const formatMinutes = (mins: number) => {
    if (mins < 1) return "< 1 menit";
    if (mins < 60) return `${Math.round(mins)} menit`;
    const hours = Math.floor(mins / 60);
    const remaining = Math.round(mins % 60);
    return `${hours} jam ${remaining} menit`;
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-text-primary mb-1">Dashboard</h1>
      <p className="text-sm text-text-muted mb-6">Ringkasan aktivitas kurir Anda</p>

      {stats.activeJob && (
        <div className="card !p-5 border-l-[4px] border-info mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-info uppercase tracking-wide mb-1">Pengiriman Aktif</p>
              <p className="font-bold text-text-primary text-lg">
                #{stats.activeJob.id.slice(0, 8)}
              </p>
              <p className="text-sm text-text-muted mt-1">
                {stats.activeJob.store?.storeName ?? "Toko"} · Rp{stats.activeJob.shippingFee?.toLocaleString("id-ID") ?? 0}
              </p>
            </div>
            <Link
              to="/dashboard/driver/jobs"
              className="btn-primary text-sm !py-2 !px-4 inline-block shrink-0"
            >
              Lihat Detail
            </Link>
          </div>
        </div>
      )}

      {!stats.activeJob && (
        <div className="card !p-5 border-l-[4px] border-warning mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-text-primary">Tidak Ada Pengiriman Aktif</p>
              <p className="text-sm text-text-muted mt-1">
                {stats.availableCount > 0
                  ? `Ada ${stats.availableCount} pekerjaan tersedia untuk Anda`
                  : "Belum ada pekerjaan tersedia saat ini"}
              </p>
            </div>
            <Link
              to="/dashboard/driver/jobs"
              className="btn-primary text-sm !py-2 !px-4 inline-block shrink-0"
            >
              Cari Pekerjaan
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Pengiriman Aktif" value={stats.onDelivery} variant="badge" color="bg-info" />
        <StatCard label="Pesanan Selesai" value={stats.delivered} variant="badge" color="bg-success" />
        <StatCard label="Saldo Dompet" value={`Rp${(wallet?.balance || 0).toLocaleString("id-ID")}`} variant="badge" color="bg-brand-deep" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Pendapatan Minggu Ini" value={`Rp${stats.weekEarnings.toLocaleString("id-ID")}`} variant="badge" color="bg-blue-500" />
        <StatCard label="Pengiriman Hari Ini" value={stats.todayDelivered} variant="badge" color="bg-purple-500" />
        <StatCard label="Rata-rata per Kiriman" value={`Rp${Math.round(stats.avgEarnings).toLocaleString("id-ID")}`} variant="badge" color="bg-teal-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="card !p-5">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-4">Ringkasan</h3>
          <div className="space-y-3">
            {stats.avgDeliveryTime > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-xl">⏱</span>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Rata-rata Waktu Pengiriman</p>
                  <p className="text-xs text-text-muted">{formatMinutes(stats.avgDeliveryTime)}</p>
                </div>
              </div>
            )}
            <div className="border-t-2 border-border-default pt-3">
              <p className="text-xs font-semibold text-text-muted mb-2">Metode Pengiriman</p>
              <div className="space-y-1.5">
                {(Object.entries(stats.methodBreakdown) as [string, number][]).map(([method, count]) => (
                  <div key={method} className="flex items-center justify-between text-sm">
                    <span className="text-text-primary">{SHIPPING_LABEL[method as keyof typeof SHIPPING_LABEL] || method}</span>
                    <span className="font-bold text-text-primary">{count} kiriman</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card !p-5">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-4">Aktivitas Terbaru</h3>
          {stats.recentDeliveries.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-4">Belum ada pengiriman selesai</p>
          ) : (
            <div className="space-y-1">
              {stats.recentDeliveries.map((job: any) => (
                <div key={job.id} className="flex items-center gap-3 py-2.5 border-b-2 border-border-default last:border-b-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      #{job.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-text-muted">{timeAgo(job.driverJob?.doneAt || job.createdAt)}</p>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-success">Selesai</span>
                  <p className="shrink-0 text-sm font-bold text-text-primary">
                    Rp{(job.driverJob?.earning || 0).toLocaleString("id-ID")}
                  </p>
                </div>
              ))}
            </div>
          )}
          {stats.delivered > 0 && (
            <Link
              to="/dashboard/driver/history"
              className="block text-center text-xs font-semibold text-brand-deep mt-3 pt-3 border-t-3 border-border-default hover:opacity-80 transition-opacity"
            >
              Lihat semua riwayat →
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default DriverDashboardPage;
