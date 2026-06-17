import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createStore } from "../api/store.api";
import { switchUserRole } from "../../auth/api/auth.api";
import useAuthStore from "../../auth/store/authStore";

export const useCreateStore = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const switchRole = useAuthStore((s) => s.switchRole);

  return useMutation({
    mutationFn: async (dto) => {
      const res = await switchUserRole("SELLER");
      switchRole("SELLER", res.accessToken);
      return createStore(dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myStore"] });
      navigate("/dashboard/seller", { replace: true });
    },
  });
};
