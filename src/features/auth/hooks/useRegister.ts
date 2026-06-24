import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth.api";
import type { RegisterData } from "../../../types";

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterData) => registerUser(data),
    onSuccess: () => {
      navigate("/auth/login?registered=true", { replace: true });
    },
  });
};
