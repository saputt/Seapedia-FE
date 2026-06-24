import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import AuthLayout from "../../shared/components/layout/AuthLayout";
import { useLogin } from "../../features/auth/hooks/useLogin";
import { getReadableError } from "../../shared/utils/errorMapper";
import { LoginForm } from "@/features/auth/components/LoginForm";
import type { LoginInput } from "@/shared/validations";

const LoginPage: React.FC = () => {
  const loginMutation = useLogin();
  const [searchParams] = useSearchParams();
  const registered = searchParams.get("registered");

  const onSubmit = (data: LoginInput) => {
    loginMutation.mutate(data);
  };

  return (
    <AuthLayout subtitle="Masuk ke akun Anda">
      {registered && (
        <div className="mb-6 p-4 border-[3px] border-success bg-success/5">
          <p className="text-success font-semibold text-sm">
            Registrasi berhasil! Silakan masuk dengan akun Anda.
          </p>
        </div>
      )}

      <LoginForm
        onSubmit={onSubmit}
        isPending={loginMutation.isPending}
        error={loginMutation.isError ? getReadableError(loginMutation.error) : undefined}
      />

      <p className="text-center text-text-secondary text-sm mt-5">
        Belum punya akun?{" "}
        <Link to="/auth/register" className="text-brand-deep font-semibold hover:underline">
          Daftar
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
