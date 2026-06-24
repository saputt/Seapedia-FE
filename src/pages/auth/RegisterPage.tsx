import React from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../shared/components/layout/AuthLayout";
import { useRegister } from "../../features/auth/hooks/useRegister";
import { getReadableError } from "../../shared/utils/errorMapper";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import type { RegisterInput } from "@/shared/validations";

const RegisterPage: React.FC = () => {
  const registerMutation = useRegister();

  const onSubmit = (data: RegisterInput) => {
    registerMutation.mutate({
      username: data.name,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <AuthLayout subtitle="Buat akun baru">
      <RegisterForm
        onSubmit={onSubmit}
        isPending={registerMutation.isPending}
        error={registerMutation.isError ? getReadableError(registerMutation.error) : undefined}
      />

      <p className="text-center text-text-secondary text-sm mt-5">
        Sudah punya akun?{" "}
        <Link to="/auth/login" className="text-brand-deep font-semibold hover:underline">
          Masuk
        </Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
