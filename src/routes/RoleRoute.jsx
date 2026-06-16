import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const roleMap = {
  buyer: "BUYER",
  seller: "SELLER",
  driver: "DRIVER",
  admin: "ADMIN",
};

const RoleRoute = ({ children, role }) => {
  const { activeRole } = useAuth();

  if (activeRole !== roleMap[role]) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleRoute;
