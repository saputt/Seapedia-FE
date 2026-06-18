import { Navigate } from "react-router-dom";
import useAuthStore from "../features/auth/store/authStore";

const BuyerRoute = ({ children }) => {
  const activeRole = useAuthStore((s) => s.activeRole);

  if (activeRole === "SELLER") {
    return <Navigate to="/dashboard/seller" replace />;
  } else if (activeRole === "DRIVER") {
    return <Navigate to="/dashboard/driver" replace />;
  }

  return children;
};

export default BuyerRoute;