import { useState } from "react";
import Button from "../../../shared/components/ui/Button";
import Spinner from "../../../shared/components/ui/Spinner";
import { useProfile, useUpdateProfile, useChangePassword } from "../../../features/user/hooks/useUser";

const ProfilePage = () => {
  const { data: profile, isLoading, error } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  const [username, setUsername] = useState("");
  const [editing, setEditing] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center py-10">
        <p className="text-danger font-semibold mb-4">Gagal memuat profil.</p>
        <Button onClick={() => window.location.reload()} variant="primary" size="sm">
          Coba Lagi
        </Button>
      </div>
    );
  }

  const handleSaveUsername = async () => {
    if (!username.trim() || username.length < 4) return;
    try {
      await updateProfileMutation.mutateAsync({ username });
      setEditing(false);
    } catch { /* handled */ }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || newPassword.length < 8) return;
    try {
      await changePasswordMutation.mutateAsync({ oldPassword, newPassword });
      setOldPassword("");
      setNewPassword("");
      setChangingPassword(false);
    } catch { /* handled */ }
  };

  return (
    <div className="max-w-[600px] mx-auto space-y-6">
      <h1 className="text-xl font-bold text-text-primary">Profil Saya</h1>

      <div className="card">
        <h2 className="text-sm font-bold text-text-primary mb-4">Informasi Akun</h2>

        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-text-muted mb-0.5">Email</p>
            <p className="text-sm text-text-secondary">{profile?.email}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-text-muted mb-0.5">Username</p>
            {editing ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-neo flex-1 !py-1.5 !text-sm"
                  placeholder={profile?.username}
                  autoFocus
                />
                <Button
                  onClick={handleSaveUsername}
                  variant="primary"
                  size="sm"
                  loading={updateProfileMutation.isPending}
                  disabled={!username.trim() || username.length < 4}
                >
                  Simpan
                </Button>
                <Button
                  onClick={() => { setEditing(false); setUsername(""); }}
                  variant="ghost"
                  size="sm"
                >
                  Batal
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-sm text-text-primary font-medium">{profile?.username}</p>
                <button
                  type="button"
                  onClick={() => { setUsername(profile?.username || ""); setEditing(true); }}
                  className="text-xs text-brand-deep hover:underline"
                >
                  Ubah
                </button>
              </div>
            )}
            {updateProfileMutation.isSuccess && (
              <p className="text-success text-xs mt-1">Username berhasil diubah!</p>
            )}
            {updateProfileMutation.isError && (
              <p className="text-danger text-xs mt-1">{updateProfileMutation.error?.message || "Gagal mengubah username."}</p>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-sm font-bold text-text-primary mb-4">Ubah Password</h2>

        {changingPassword ? (
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
                onClick={handleChangePassword}
                variant="primary"
                loading={changePasswordMutation.isPending}
                disabled={!oldPassword || !newPassword || newPassword.length < 8}
              >
                {changePasswordMutation.isPending ? "Mengubah..." : "Simpan Password"}
              </Button>
              <Button
                onClick={() => { setChangingPassword(false); setOldPassword(""); setNewPassword(""); changePasswordMutation.reset(); }}
                variant="ghost"
              >
                Batal
              </Button>
            </div>
            {changePasswordMutation.isSuccess && (
              <p className="text-success text-xs">Password berhasil diubah!</p>
            )}
            {changePasswordMutation.isError && (
              <p className="text-danger text-xs">{changePasswordMutation.error?.message || "Gagal mengubah password."}</p>
            )}
          </div>
        ) : (
          <Button onClick={() => setChangingPassword(true)} variant="ghost">
            Ubah Password
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
