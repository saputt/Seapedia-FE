import { Navigate } from "react-router-dom";
import useAuthStore from "../features/auth/store/authStore";

const roleMap = {
  buyer: "BUYER",
  seller: "SELLER",
  driver: "DRIVER",
  admin: "ADMIN",
};

const RoleRoute = ({ children, role }) => {
  const activeRole = useAuthStore((s) => s.activeRole);

  if (activeRole !== roleMap[role]) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleRoute;
