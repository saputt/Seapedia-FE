import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../shared/components/ui/Button";
import Input from "../../../shared/components/ui/Input";
import { passwordChangeSchema, type PasswordChangeInput } from "@/shared/validations";

interface PasswordFormProps {
  onSubmit: (data: { oldPassword: string; newPassword: string }) => Promise<void>;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string;
}

const PasswordForm = ({ onSubmit, isPending, isSuccess, isError, errorMessage }: PasswordFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordChangeInput>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmitForm = async (data: PasswordChangeInput) => {
    try {
      await onSubmit({ oldPassword: data.currentPassword, newPassword: data.newPassword });
      reset();
    } catch {
      // form fields preserved so user can retry
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-3">
      <div>
        <p className="text-xs font-semibold text-text-muted mb-0.5">Password Lama</p>
        <Input
          type="password"
          {...register("currentPassword")}
          className="input-neo w-full !py-1.5 !text-sm"
          placeholder="Masukkan password lama"
          error={errors.currentPassword?.message}
        />
      </div>
      <div>
        <p className="text-xs font-semibold text-text-muted mb-0.5">Password Baru</p>
        <Input
          type="password"
          {...register("newPassword")}
          className="input-neo w-full !py-1.5 !text-sm"
          placeholder="Minimal 6 karakter"
          error={errors.newPassword?.message}
        />
      </div>
      <div>
        <p className="text-xs font-semibold text-text-muted mb-0.5">Konfirmasi Password Baru</p>
        <Input
          type="password"
          {...register("confirmNewPassword")}
          className="input-neo w-full !py-1.5 !text-sm"
          placeholder="Ulangi password baru"
          error={errors.confirmNewPassword?.message}
        />
      </div>
      <div className="flex gap-2">
        <Button
          type="submit"
          variant="primary"
          loading={isPending}
        >
          {isPending ? "Mengubah..." : "Simpan Password"}
        </Button>
        <Button
          type="button"
          onClick={() => reset()}
          variant="ghost"
        >
          Batal
        </Button>
      </div>
      {isSuccess && <p className="text-success text-xs">Password berhasil diubah!</p>}
      {isError && <p className="text-danger text-xs">{errorMessage || "Gagal mengubah password."}</p>}
    </form>
  );
};

export default PasswordForm;
