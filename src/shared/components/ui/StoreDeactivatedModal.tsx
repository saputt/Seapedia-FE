import { useNavigate } from "react-router-dom";
import { useMyStore } from "../../../features/store/hooks/useMyStore";
import useAuthStore from "../../../features/auth/store/authStore";
import { useSwitchRole } from "../../../features/auth/hooks/useSwitchRole";
import Button from "./Button";

const StoreDeactivatedModal = () => {
  const navigate = useNavigate();
  const activeRole = useAuthStore((s) => s.activeRole);
  const { data: store } = useMyStore({ refetchInterval: 8000 }) as any;
  const switchRole = useSwitchRole();

  if (activeRole !== "SELLER") return null;

  const isDeactivated = store && !store.isActive;
  if (!isDeactivated) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="card max-w-sm w-full text-center">
        <div className="text-5xl mb-4">⛔</div>
        <h3 className="text-xl font-bold text-text-primary mb-2">Toko Dinonaktifkan</h3>
        <p className="text-text-secondary text-sm mb-2 leading-relaxed">
          Toko <strong className="text-text-primary">{store.storeName}</strong> telah dinonaktifkan oleh admin.
        </p>
        {store.deactivationReason && (
          <p className="text-text-secondary text-xs italic mb-4 leading-relaxed bg-bg-tertiary rounded-lg px-3 py-2">
            "{store.deactivationReason}"
          </p>
        )}
        {!store.deactivationReason && (
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
            onClick={() => switchRole.mutate("DRIVER")}
            variant="ghost"
            fullWidth
            size="sm"
          >
            Beralih ke Driver
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StoreDeactivatedModal;
