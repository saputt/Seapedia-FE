import { useNavigate } from "react-router-dom";

export const useViewNavigate = () => {
  const navigate = useNavigate();
  return (to: string, options?: Parameters<typeof navigate>[1]) => {
    navigate(to, { ...options, viewTransition: true });
  };
};
