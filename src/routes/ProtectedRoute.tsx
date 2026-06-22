import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../features/auth/store/authStore";
import Button from "../shared/components/ui/Button";
import { RoleName } from "../types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: RoleName[];
  requireAuth?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

const roleHierarchy: Record<RoleName, RoleName[]> = {
  BUYER: ["BUYER"],
  SELLER: ["SELLER", "BUYER"],
  DRIVER: ["DRIVER"],
  ADMIN: ["ADMIN", "SELLER", "BUYER", "DRIVER"],
};

const ProtectedRoute = ({
  children,
  allowedRoles,
  requireAuth = true,
  redirectTo,
  fallback,
}: ProtectedRouteProps) => {
  const location = useLocation();
  const token = useAuthStore((s) => s.token);
  const activeRole = useAuthStore((s) => s.activeRole);
  const userRoles = useAuthStore((s) => s.userRoles);

  const defaultRedirect = redirectTo ?? (requireAuth ? "/auth/login" : "/");

  if (requireAuth && !token) {
    if (fallback) return fallback;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div
          className="card max-w-sm w-full text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-5xl mb-4">🔒</div>
          <h3 className="text-xl font-bold text-text-primary mb-2">
            Login Diperlukan
          </h3>
          <p className="text-text-secondary mb-6 leading-relaxed">
            Anda harus login terlebih dahulu untuk mengakses halaman ini.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button onClick={() => window.history.back()} variant="ghost" size="sm">
              Kembali
            </Button>
            <Button
              onClick={() => window.location.href = `/auth/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
              variant="primary"
              size="sm"
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!requireAuth && token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && activeRole) {
    const hasAccess = allowedRoles.some((role) =>
      roleHierarchy[activeRole]?.includes(role) ?? false
    );

    if (!hasAccess) {
      const roleRedirectMap: Record<RoleName, string> = {
        BUYER: "/",
        SELLER: "/dashboard/seller",
        DRIVER: "/dashboard/driver",
        ADMIN: "/dashboard/admin",
      };
      return <Navigate to={roleRedirectMap[activeRole] ?? "/"} replace />;
    }
  }

  if (allowedRoles && !activeRole && token) {
    return <Navigate to="/auth/role-select" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;