import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createStore } from "../api/store.api";
import { switchUserRole } from "../../auth/api/auth.api";
import useAuthStore from "../../auth/store/authStore";
import type { StoreInput } from "../../../types";

export const useCreateStore = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const switchRole = useAuthStore((s) => s.switchRole);

  return useMutation({
    mutationFn: async (dto: StoreInput) => {
      await createStore(dto);
      const res = await switchUserRole("SELLER");
      switchRole("SELLER", res.accessToken, res.userRoles);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myStore"] });
      navigate("/dashboard/seller", { replace: true });
    },
  });
};
