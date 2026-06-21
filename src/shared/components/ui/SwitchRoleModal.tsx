import Spinner from "./Spinner";
import type { RoleName } from "../../../types";

export type SwitchRoleModalProps = {
  role: RoleName | null;
};

const roleLabel: Record<RoleName, string> = {
  SELLER: "Penjual",
  BUYER: "Pembeli",
  DRIVER: "Driver",
  ADMIN: "Admin",
};

const roleIcon: Record<RoleName, string> = {
  SELLER: "🏪",
  BUYER: "🛍️",
  DRIVER: "🚚",
  ADMIN: "⚙️",
};

const SwitchRoleModal = ({ role }: SwitchRoleModalProps) => {
  if (!role) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="card !p-8 mx-4 flex flex-col items-center gap-4 min-w-[280px]">
        <span className="text-4xl">{roleIcon[role]}</span>
        <p className="text-lg font-semibold text-text-primary text-center">
          Beralih ke {roleLabel[role]}
        </p>
        <Spinner size="lg" />
        <p className="text-sm text-text-muted">Mohon tunggu sebentar...</p>
      </div>
    </div>
  );
};

export default SwitchRoleModal;
