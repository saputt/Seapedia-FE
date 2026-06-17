import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createStore } from "../api/store.api";
import { switchUserRole } from "../../auth/api/auth.api";
import useAuthStore from "../../auth/store/authStore";

export const useCreateStore = () => {
  const navigate = useNavigate();
  const switchRole = useAuthStore((s) => s.switchRole);

  return useMutation({
    mutationFn: createStore,
    onSuccess: async () => {
      try {
        const res = await switchUserRole("SELLER");
        switchRole("SELLER", res.accessToken);
      } catch {
        /* silent */
      }
      navigate("/dashboard/seller", { replace: true });
    },
  });
};
