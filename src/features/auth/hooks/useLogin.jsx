import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth.api";
import useAuthStore from "../store/authStore";
import { decodeToken } from "../../../shared/utils/jwt";

export const useLogin = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      const payload = decodeToken(data.accessToken);

      login({
        token: data.accessToken,
        user: { id: payload?.id, email: payload?.email, username: data.username },
        roles: data.userRoles,
        activeRole: data.activeRole,
      });

      if (data.userRoles.length > 1) {
        navigate("/auth/role-select", { replace: true });
      } else {
        const redirectPath =
          data.activeRole === "BUYER" ? "/" : `/dashboard/${data.activeRole.toLowerCase()}`;
        navigate(redirectPath, { replace: true });
      }
    },
  });
};
