import React, { useRef } from "react";
import { useState } from "react";
import Button from "../../../shared/components/ui/Button";
import Spinner from "../../../shared/components/ui/Spinner";
import Avatar from "../../../shared/components/ui/Avatar";
import ErrorState from "../../../shared/components/ui/ErrorState";
import PasswordForm from "../../../features/user/components/PasswordForm";
import { useProfile, useUpdateProfile, useUpdateProfileImage, useChangePassword } from "../../../features/user/hooks/useUser";

const ProfilePage: React.FC = () => {
  const { data: profile, isLoading, error } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const updateImageMutation = useUpdateProfileImage();
  const changePasswordMutation = useChangePassword();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState("");
  const [editing, setEditing] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message="Gagal memuat profil." onRetry={() => window.location.reload()} />;
  }

  const handleSaveUsername = async () => {
    if (!username.trim() || username.length < 4) return;
    try {
      await updateProfileMutation.mutateAsync({ username });
      setEditing(false);
    } catch { /* handled */ }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    updateImageMutation.mutate(file);
  };

  return (
    <div className="max-w-[600px] mx-auto px-3 lg:px-0 space-y-6">
      <h1 className="text-xl font-bold text-text-primary">Profil Saya</h1>

      <div className="card flex items-center gap-4">
        <div className="relative">
          <Avatar src={profile?.imageUrl} name={profile?.username || "User"} size="lg" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-5 h-5 bg-brand-deep text-white rounded-full flex items-center justify-center text-xs"
          >
            +
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
        <div>
          <p className="text-lg font-bold text-text-primary">{profile?.username}</p>
          <p className="text-sm text-text-muted">{profile?.email}</p>
        </div>
        {updateImageMutation.isPending && <Spinner size="sm" />}
      </div>

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
        <PasswordForm
          onSubmit={({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) => changePasswordMutation.mutateAsync({ oldPassword, newPassword })}
          isPending={changePasswordMutation.isPending}
          isSuccess={changePasswordMutation.isSuccess}
          isError={changePasswordMutation.isError}
          errorMessage={changePasswordMutation.error?.message}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
