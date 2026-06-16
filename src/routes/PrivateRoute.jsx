import { Navigate } from "react-router-dom";
import useAuthStore from "../features/auth/store/authStore";

const PrivateRoute = ({ children }) => {
  const token = useAuthStore((s) => s.token);

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default PrivateRoute;
