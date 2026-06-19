import { Navigate } from "react-router-dom";
import useAuthStore from "../features/auth/store/authStore";

const SellerRoute = ({ children }) => {
  const activeRole = useAuthStore((s) => s.activeRole);

  if (activeRole === "BUYER") {
    return <Navigate to="/" replace />;
  } else if (activeRole === "DRIVER") {
    return <Navigate to="/dashboard/driver" replace />;
  }

  return children;
};

export default SellerRoute;