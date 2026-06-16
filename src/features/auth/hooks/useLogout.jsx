import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export const useLogout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  return useCallback(() => {
    logout();
    navigate("/", { replace: true });
  }, [logout, navigate]);
};
