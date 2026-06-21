import { useState } from "react";
import Button from "../../../shared/components/ui/Button";

/**
 * Form untuk mengubah password.
 * Diekstrak dari ProfilePage.
 *
 * @param {Object} props
 * @param {Function} props.onSubmit - Handler submit ({ oldPassword, newPassword }) => Promise
 * @param {boolean} props.isPending - Status loading submit
 * @param {boolean} props.isSuccess - Status sukses
 * @param {boolean} props.isError - Status error
 * @param {string} [props.errorMessage] - Pesan error
 */
const PasswordForm = ({ onSubmit, isPending, isSuccess, isError, errorMessage }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword || newPassword.length < 8) return;
    try {
      await onSubmit({ oldPassword, newPassword });
      setOldPassword("");
      setNewPassword("");
      setExpanded(false);
    } catch {
      // form fields preserved so user can retry
    }
  };

  if (!expanded) {
    return <Button onClick={() => setExpanded(true)} variant="ghost">Ubah Password</Button>;
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs font-semibold text-text-muted mb-0.5">Password Lama</p>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="input-neo w-full !py-1.5 !text-sm"
          placeholder="Masukkan password lama"
        />
      </div>
      <div>
        <p className="text-xs font-semibold text-text-muted mb-0.5">Password Baru</p>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="input-neo w-full !py-1.5 !text-sm"
          placeholder="Minimal 8 karakter"
        />
      </div>
      <div className="flex gap-2">
        <Button
          onClick={handleSubmit}
          variant="primary"
          loading={isPending}
          disabled={!oldPassword || !newPassword || newPassword.length < 8}
        >
          {isPending ? "Mengubah..." : "Simpan Password"}
        </Button>
        <Button
          onClick={() => { setExpanded(false); setOldPassword(""); setNewPassword(""); }}
          variant="ghost"
        >
          Batal
        </Button>
      </div>
      {isSuccess && <p className="text-success text-xs">Password berhasil diubah!</p>}
      {isError && <p className="text-danger text-xs">{errorMessage || "Gagal mengubah password."}</p>}
    </div>
  );
};

export default PasswordForm;
