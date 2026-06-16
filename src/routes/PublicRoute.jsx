import { Navigate } from "react-router-dom";
import useAuthStore from "../features/auth/store/authStore";

const PublicRoute = ({ children }) => {
  const token = useAuthStore((s) => s.token);

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
