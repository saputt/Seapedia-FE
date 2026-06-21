import { useNavigate } from "react-router-dom";
import useAuthStore from "../features/auth/store/authStore";
import Button from "../shared/components/ui/Button";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);

  if (!token) {
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
            <Button onClick={() => navigate(-1)} variant="ghost" size="sm">
              Kembali
            </Button>
            <Button
              onClick={() => navigate("/auth/login")}
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

  return children;
};

export default PrivateRoute;
