import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createStore } from "../api/store.api";

export const useCreateStore = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createStore,
    onSuccess: () => {
      navigate("/dashboard/seller", { replace: true });
    },
  });
};
