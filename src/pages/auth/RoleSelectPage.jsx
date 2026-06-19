import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "../../features/auth/store/authStore";
import { switchUserRole } from "../../features/auth/api/auth.api";
import { getReadableError } from "../../shared/utils/errorMapper";
import Spinner from "../../shared/components/ui/Spinner";

const roleConfig = {
  BUYER: { label: "Pembeli", desc: "Belanja produk dari berbagai toko", color: "role-buyer", emoji: "🛒" },
  SELLER: { label: "Penjual", desc: "Kelola toko dan produk Anda", color: "role-seller", emoji: "🏪" },
  DRIVER: { label: "Kurir", desc: "Antarkan pesanan ke pembeli", color: "role-driver", emoji: "🚚" },
  ADMIN: { label: "Admin", desc: "Kelola sistem dan pengguna", color: "role-admin", emoji: "⚙️" },
};

const RoleSelectPage = () => {
  const navigate = useNavigate();
  const userRoles = useAuthStore((s) => s.userRoles);
  const switchRole = useAuthStore((s) => s.switchRole);
  const [selectedRole, setSelectedRole] = useState(null);

  const switchMutation = useMutation({
    mutationFn: switchUserRole,
    onSuccess: (data) => {
      switchRole(data.activeRole, data.accessToken);
      const redirectPath =
        data.activeRole === "BUYER" ? "/products" : `/dashboard/${data.activeRole.toLowerCase()}`;
      navigate(redirectPath, { replace: true });
    },
  });

  const handleSelect = (role) => {
    setSelectedRole(role);
    switchMutation.mutate(role);
  };

  if (!userRoles || userRoles.length === 0) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-[2rem] font-bold text-text-primary">Pilih Role</h1>
          <p className="text-text-secondary mt-2">Pilih peran yang ingin Anda gunakan</p>
        </div>

        <div className="grid gap-4">
          {userRoles.map((role) => {
            const config = roleConfig[role] || {
              label: role,
              desc: "",
              color: "brand-deep",
              emoji: "🔹",
            };
            const isLoading = switchMutation.isPending && selectedRole === role;

            return (
              <button
                key={role}
                onClick={() => handleSelect(role)}
                disabled={switchMutation.isPending}
                className={`card text-left flex items-center gap-5 hover:translate-x-1 transition-all ${
                  switchMutation.isPending && selectedRole !== role
                    ? "opacity-40 cursor-not-allowed"
                    : ""
                }`}
                style={{
                  borderColor: `var(--color-${config.color})`,
                  boxShadow: `4px 4px 0px 0px var(--color-${config.color})`,
                }}
              >
                <span className="text-3xl">{config.emoji}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-text-primary">{config.label}</h3>
                  <p className="text-text-secondary text-sm">{config.desc}</p>
                </div>
                {isLoading && (
                  <Spinner size="sm" />
                )}
                {!isLoading && (
                  <span className="text-text-muted text-sm">Pilih &rarr;</span>
                )}
              </button>
            );
          })}
        </div>

        {switchMutation.isError && (
          <div className="mt-4 p-3 border-[3px] border-danger bg-danger/5">
            <p className="text-danger text-sm font-medium">
              {getReadableError(switchMutation.error)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSelectPage;
