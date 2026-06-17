import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AuthLayout from "../../shared/components/layout/AuthLayout";
import { useLogin } from "../../features/auth/hooks/useLogin";
import { getReadableError } from "../../shared/utils/errorMapper";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLogin();
  const [searchParams] = useSearchParams();
  const registered = searchParams.get("registered");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    loginMutation.mutate({ email, password });
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

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className="block text-text-secondary font-medium text-sm mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-neo w-full"
            placeholder="contoh@email.com"
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label className="block text-text-secondary font-medium text-sm mb-1.5">
            Kata Sandi
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-neo w-full"
            placeholder="Masukkan kata sandi"
            autoComplete="current-password"
            required
          />
        </div>

        {loginMutation.isError && (
          <div className="p-3 border-[3px] border-danger bg-danger/5">
            <p className="text-danger text-sm font-medium">
              {getReadableError(loginMutation.error)}
            </p>
          </div>
        )}

        <button
          type="submit"
          className="btn-primary w-full !py-3 flex items-center justify-center gap-2"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Memproses...
            </>
          ) : (
            "Masuk"
          )}
        </button>

        <p className="text-center text-text-secondary text-sm">
          Belum punya akun?{" "}
          <Link to="/auth/register" className="text-brand-deep font-semibold hover:underline">
            Daftar
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
