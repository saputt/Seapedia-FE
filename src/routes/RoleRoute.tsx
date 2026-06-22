import { Navigate } from "react-router-dom";
import useAuthStore from "../features/auth/store/authStore";
import { RoleName } from "../types";

const roleMap: Record<string, RoleName> = {
  buyer: "BUYER",
  seller: "SELLER",
  driver: "DRIVER",
  admin: "ADMIN",
};

interface RoleRouteProps {
  children: React.ReactNode;
  role: string;
}

const activeRoleHome: Record<string, string> = {
  BUYER: "/",
  SELLER: "/dashboard/seller",
  DRIVER: "/dashboard/driver",
  ADMIN: "/dashboard/admin",
};

const RoleRoute = ({ children, role }: RoleRouteProps) => {
  const activeRole = useAuthStore((s) => s.activeRole);

  if (activeRole !== roleMap[role]) {
    return <Navigate to={activeRole ? activeRoleHome[activeRole] : "/auth/login"} replace />;
  }

  return children;
};

export default RoleRoute;
