import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../shared/components/layout/AuthLayout";
import { useRegister } from "../../features/auth/hooks/useRegister";
import { getReadableError } from "../../shared/utils/errorMapper";

const RegisterPage = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [validationError, setValidationError] = useState("");
  const registerMutation = useRegister();

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setValidationError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");

    if (form.username.length < 4) {
      setValidationError("Nama pengguna minimal 4 karakter");
      return;
    }
    if (form.password.length < 8) {
      setValidationError("Kata sandi minimal 8 karakter");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setValidationError("Konfirmasi kata sandi tidak cocok");
      return;
    }

    registerMutation.mutate({
      username: form.username,
      email: form.email,
      password: form.password,
    });
  };

  return (
    <AuthLayout subtitle="Buat akun baru">
      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className="block text-text-secondary font-medium text-sm mb-1.5">
            Nama Pengguna
          </label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => updateField("username", e.target.value)}
            className="input-neo w-full"
            placeholder="Minimal 4 karakter"
            autoComplete="username"
            required
          />
        </div>

        <div>
          <label className="block text-text-secondary font-medium text-sm mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
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
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            className="input-neo w-full"
            placeholder="Minimal 8 karakter"
            autoComplete="new-password"
            required
          />
        </div>

        <div>
          <label className="block text-text-secondary font-medium text-sm mb-1.5">
            Konfirmasi Kata Sandi
          </label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(e) => updateField("confirmPassword", e.target.value)}
            className="input-neo w-full"
            placeholder="Ulangi kata sandi"
            autoComplete="new-password"
            required
          />
        </div>

        {(validationError || registerMutation.isError) && (
          <div className="p-3 border-[3px] border-danger bg-danger/5">
            <p className="text-danger text-sm font-medium">
              {validationError || getReadableError(registerMutation.error)}
            </p>
          </div>
        )}

        <button
          type="submit"
          className="btn-primary w-full !py-3 flex items-center justify-center gap-2"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Mendaftar...
            </>
          ) : (
            "Daftar"
          )}
        </button>

        <p className="text-center text-text-secondary text-sm">
          Sudah punya akun?{" "}
          <Link to="/auth/login" className="text-brand-deep font-semibold hover:underline">
            Masuk
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
