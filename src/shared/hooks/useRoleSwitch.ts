import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../features/auth/store/authStore";
import { switchUserRole } from "../../features/auth/api/auth.api";
import type { RoleName } from "../../types";

interface UseRoleSwitchOptions {
  onSuccess?: (role: RoleName) => void;
  onError?: (role: RoleName, error: Error) => void;
}

export function useRoleSwitch(options?: UseRoleSwitchOptions) {
  const navigate = useNavigate();
  const switchRole = useAuthStore((s) => s.switchRole);
  const [switching, setSwitching] = useState(false);
  const [switchingRole, setSwitchingRole] = useState<RoleName | null>(null);
  const [successModal, setSuccessModal] = useState<{
    title: string;
    message: string;
    redirectTo: string;
  } | null>(null);

  const switchToRole = useCallback(
    async (role: RoleName, redirectTo: string) => {
      setSwitching(true);
      setSwitchingRole(role);
      try {
        const res = await switchUserRole(role);
        switchRole(role, res.accessToken, res.userRoles);
        setSuccessModal({
          title: "Role Berhasil Diganti",
          message: `Anda sekarang berada di mode ${role}.`,
          redirectTo,
        });
        options?.onSuccess?.(role);
      } catch (error) {
        options?.onError?.(role, error as Error);
      } finally {
        setSwitching(false);
        setSwitchingRole(null);
      }
    },
    [switchRole, options]
  );

  const closeSuccessModal = useCallback(() => {
    if (successModal) {
      navigate(successModal.redirectTo, { replace: true });
    }
    setSuccessModal(null);
  }, [successModal, navigate]);

  return {
    switching,
    switchingRole,
    successModal,
    switchToRole,
    closeSuccessModal,
  };
}

export default useRoleSwitch;
