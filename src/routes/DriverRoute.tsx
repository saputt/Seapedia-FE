import { Navigate } from "react-router-dom";
import useAuthStore from "../features/auth/store/authStore";
import DriverSuspendedModal from "../shared/components/ui/DriverSuspendedModal";

interface DriverRouteProps {
  children: React.ReactNode;
}

const DriverRoute = ({ children }: DriverRouteProps) => {
  const activeRole = useAuthStore((s) => s.activeRole);

  if (activeRole === "BUYER") {
    return <Navigate to="/" replace />;
  } else if (activeRole === "SELLER") {
    return <Navigate to="/dashboard/seller" replace />;
  } else if (activeRole === "ADMIN") {
    return <Navigate to="/dashboard/admin" replace />;
  } else if (!activeRole) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <>
      <DriverSuspendedModal />
      {children}
    </>
  );
};

export default DriverRoute;
