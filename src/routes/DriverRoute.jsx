import { Navigate } from "react-router-dom";
import useAuthStore from "../features/auth/store/authStore";

const DriverRoute = ({ children }) => {
  const activeRole = useAuthStore((s) => s.activeRole);

  if (activeRole === "SELLER") {
    return <Navigate to="/dashboard/seller" replace />;
  } else if (activeRole === "BUYER") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default DriverRoute;