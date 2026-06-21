import { Navigate } from "react-router-dom";
import useAuthStore from "../features/auth/store/authStore";

interface SellerRouteProps {
  children: React.ReactNode;
}

const SellerRoute = ({ children }: SellerRouteProps) => {
  const activeRole = useAuthStore((s) => s.activeRole);

  if (activeRole === "BUYER") {
    return <Navigate to="/" replace />;
  } else if (activeRole === "DRIVER") {
    return <Navigate to="/dashboard/driver" replace />;
  } else if (activeRole === "ADMIN") {
    return <Navigate to="/dashboard/admin" replace />;
  } else if (!activeRole) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default SellerRoute;
