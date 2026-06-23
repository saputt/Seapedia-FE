import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import { registerSchema, type RegisterInput } from "@/shared/validations";

interface RegisterFormProps {
  onSubmit: (data: RegisterInput) => void;
  isPending?: boolean;
  error?: string;
}

export const RegisterForm = ({ onSubmit, isPending = false, error }: RegisterFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const passwordMismatch = password && confirmPassword && password !== confirmPassword;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5">
      {error && (
        <div className="p-3 border-[3px] border-danger bg-danger/5">
          <p className="text-danger text-sm font-medium">{error}</p>
        </div>
      )}

      <Input
        {...register("name")}
        label="Nama Pengguna"
        type="text"
        placeholder="Minimal 2 karakter"
        autoComplete="username"
        error={errors.name?.message}
      />

      <Input
        {...register("email")}
        label="Email"
        type="email"
        placeholder="contoh@email.com"
        autoComplete="email"
        error={errors.email?.message}
      />

      <Input
        {...register("password")}
        label="Kata Sandi"
        type="password"
        placeholder="Minimal 6 karakter"
        autoComplete="new-password"
        error={errors.password?.message}
      />

      <Input
        {...register("confirmPassword")}
        label="Konfirmasi Kata Sandi"
        type="password"
        placeholder="Ulangi kata sandi"
        autoComplete="new-password"
        error={errors.confirmPassword?.message || (passwordMismatch ? "Password tidak cocok" : undefined)}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isPending}
      >
        {isPending ? "Mendaftar..." : "Daftar"}
      </Button>
    </form>
  );
};