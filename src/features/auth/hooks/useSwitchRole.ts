import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { switchUserRole } from "../api/auth.api";
import useAuthStore from "../store/authStore";
import type { RoleName } from "../../../types";

export const useSwitchRole = () => {
  const navigate = useNavigate();
  const switchRole = useAuthStore((s) => s.switchRole);

  return useMutation({
    mutationFn: (role: RoleName) => switchUserRole(role),
    onSuccess: (data) => {
      switchRole(data.activeRole, data.accessToken, data.userRoles);
      const redirectPath =
        data.activeRole === "BUYER" ? "/" : `/dashboard/${data.activeRole.toLowerCase()}`;
      navigate(redirectPath, { replace: true });
    },
  });
};
