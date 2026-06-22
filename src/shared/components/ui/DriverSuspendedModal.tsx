import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../features/auth/store/authStore";
import { useProfile } from "../../../features/user/hooks/useUser";
import { useSwitchRole } from "../../../features/auth/hooks/useSwitchRole";
import Button from "./Button";

const DriverSuspendedModal = () => {
  const navigate = useNavigate();
  const activeRole = useAuthStore((s) => s.activeRole);
  const { data: profile } = useProfile({ refetchInterval: 8000 });
  const switchRole = useSwitchRole();

  if (activeRole !== "DRIVER") return null;

  const isSuspended = profile && (profile as any).isSuspended;
  if (!isSuspended) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="card max-w-sm w-full text-center">
        <div className="text-5xl mb-4">⛔</div>
        <h3 className="text-xl font-bold text-text-primary mb-2">Akun Driver Disuspen</h3>
        <p className="text-text-secondary text-sm mb-2 leading-relaxed">
          Akun driver Anda telah disuspen oleh admin.
        </p>
        {(profile as any).suspensionReason && (
          <p className="text-text-secondary text-xs italic mb-4 leading-relaxed bg-bg-tertiary rounded-lg px-3 py-2">
            "{(profile as any).suspensionReason}"
          </p>
        )}
        {!(profile as any).suspensionReason && (
          <p className="text-text-muted text-xs mb-4">Tidak ada alasan yang diberikan.</p>
        )}
        <p className="text-text-secondary text-sm mb-6 leading-relaxed">
          Silakan beralih ke peran lain untuk melanjutkan.
        </p>
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => switchRole.mutate("BUYER")}
            variant="primary"
            fullWidth
            size="sm"
          >
            Beralih ke Pembeli
          </Button>
          <Button
            onClick={() => switchRole.mutate("SELLER")}
            variant="ghost"
            fullWidth
            size="sm"
          >
            Beralih ke Penjual
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DriverSuspendedModal;
