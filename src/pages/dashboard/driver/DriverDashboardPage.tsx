import React, { useMemo } from "react";
import { VTLink as Link } from "../../../shared/utils/VTLink";
import { useMyDriverJobs, useAvailableJobs } from "../../../features/driver/hooks/useDriverJobs";
import { useWallet } from "../../../features/wallet/hooks/useWallet";
import { getMyDriverReviews } from "../../../features/driver/api/driverReview.api";
import Spinner from "../../../shared/components/ui/Spinner";
import StatCard from "../../../shared/components/ui/StatCard";
import StarRating from "../../../shared/components/ui/StarRating";
import DriverEarningsChart from "../../../features/driver/components/DriverEarningsChart";
import { useQuery } from "@tanstack/react-query";

const DriverDashboardPage: React.FC = () => {
  const { data: jobs = [], isLoading } = useMyDriverJobs() as any;
  const { data: wallet } = useWallet() as any;
  const { data: availableJobs } = useAvailableJobs() as any;
  const { data: reviewData } = useQuery({
    queryKey: ["myDriverReviews"],
    queryFn: getMyDriverReviews,
  });

  const reviewStats = reviewData?.stats;

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

    const todayEarnings = todayDelivered.reduce((sum: number, j: any) => sum + (j.driverJob?.earning || 0), 0);
    const weekEarnings = weekDelivered.reduce((sum: number, j: any) => sum + (j.driverJob?.earning || 0), 0);

    return {
      onDelivery: onDelivery.length,
      delivered: delivered.length,
      todayDelivered: todayDelivered.length,
      todayEarnings,
      weekEarnings,
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

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Saldo Dompet"
          value={`Rp${(wallet?.balance || 0).toLocaleString("id-ID")}`}
          variant="badge"
          color="bg-brand-deep"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
            </svg>
          }
        />
        <StatCard
          label="Pendapatan Hari Ini"
          value={`Rp${stats.todayEarnings.toLocaleString("id-ID")}`}
          variant="badge"
          color="bg-success"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <line x1="12" x2="12" y1="2" y2="22" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          }
        />
        <StatCard
          label="Pengiriman Hari Ini"
          value={stats.todayDelivered}
          variant="badge"
          color="bg-info"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          }
        />
        <StatCard
          label="Rating"
          value={reviewStats ? `${reviewStats.averageRating.toFixed(1)}` : "-"}
          variant="badge"
          color="bg-warning"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          }
        />
      </div>

      <div className="card !p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-text-primary">Pendapatan Minggu Ini</p>
            <p className="text-xs text-text-muted mt-0.5">{stats.weekEarnings > 0 ? `${stats.weekEarnings.toLocaleString("id-ID")} dari ${stats.delivered} pengiriman` : "Belum ada pengiriman"}</p>
          </div>
          <p className="text-2xl font-bold text-text-primary">
            Rp{stats.weekEarnings.toLocaleString("id-ID")}
          </p>
        </div>
        {stats.weekEarnings > 0 && stats.todayEarnings > 0 && (
          <div className="mt-3 pt-3 border-t-2 border-border-default">
            <div className="w-full bg-bg-tertiary rounded-full h-2">
              <div
                className="bg-brand-deep h-2 rounded-full transition-all"
                style={{ width: `${Math.min((stats.todayEarnings / stats.weekEarnings) * 100, 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-text-muted mt-1">{Math.round((stats.todayEarnings / stats.weekEarnings) * 100)}% dari total minggu ini</p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <DriverEarningsChart jobs={jobs} />
      </div>
    </>
  );
};

export default DriverDashboardPage;
