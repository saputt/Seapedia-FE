import React, { useRef } from "react";
import Spinner from "../../../shared/components/ui/Spinner";
import Avatar from "../../../shared/components/ui/Avatar";
import ErrorState from "../../../shared/components/ui/ErrorState";
import { useProfile, useUpdateProfileImage } from "../../../features/user/hooks/useUser";

const DriverProfilePage: React.FC = () => {
  const { data: profile, isLoading, error } = useProfile();
  const updateImageMutation = useUpdateProfileImage();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return;
    updateImageMutation.mutate(file);
  };

  return (
    <div className="max-w-[600px] mx-auto space-y-6">
      <h1 className="text-xl font-bold text-text-primary">Profil Driver</h1>

      <div className="card flex flex-col items-center gap-4 py-8">
        <div className="relative">
          <Avatar src={profile?.imageUrl} name={profile?.username || "Driver"} size="lg" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-6 h-6 bg-brand-deep text-white rounded-full flex items-center justify-center text-sm shadow-md"
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
        <p className="text-lg font-bold text-text-primary">{profile?.username}</p>
        <p className="text-sm text-text-muted -mt-2">{profile?.email}</p>

        {updateImageMutation.isPending && (
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Spinner size="sm" />
            Mengupload...
          </div>
        )}
        {updateImageMutation.isSuccess && (
          <p className="text-sm text-success font-medium">Foto profil berhasil diperbarui!</p>
        )}
        {updateImageMutation.isError && (
          <p className="text-sm text-danger font-medium">{updateImageMutation.error?.message || "Gagal mengupload foto."}</p>
        )}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-sm text-brand-deep font-medium hover:underline mt-2"
        >
          Ganti Foto Profil
        </button>
      </div>
    </div>
  );
};

export default DriverProfilePage;
