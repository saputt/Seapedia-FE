import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import { loginSchema, type LoginInput } from "@/shared/validations";

interface LoginFormProps {
  onSubmit: (data: LoginInput) => void;
  isPending?: boolean;
  error?: string;
}

export const LoginForm = ({ onSubmit, isPending = false, error }: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5">
      {error && (
        <div className="p-3 border-[3px] border-danger bg-danger/5">
          <p className="text-danger text-sm font-medium">{error}</p>
        </div>
      )}

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
        placeholder="Masukkan kata sandi"
        autoComplete="current-password"
        error={errors.password?.message}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isPending}
      >
        {isPending ? "Memproses..." : "Masuk"}
      </Button>
    </form>
  );
};